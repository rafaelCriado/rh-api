import User from '../models/User';
import * as Yup from 'yup';

class UserController {
  //Inserir usuario
  async store(req, res) {
    try {
      let schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required(),
      });

      schema.validate(req.body).catch(err => {
        return res.status(400).json({ error: err.errors[0] });
      });

      const { email } = req.body;
      const userExists = await User.findOne({ where: { email } });

      if (userExists)
        return res.status(400).json({ error: 'Email is already in use' });

      const user = await User.create(req.body);
      const token = user.tokenGenerate();

      const { id, name } = user;

      return res.json({ user: { id, name, email }, token });
    } catch (err) {
      return res.status(500).json({ error: 'Create user failed, try again' });
    }
  }

  //Atualizar Usuario
  async uptade(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        confirmPassword: Yup.string().when('password', (password, field) =>
          password
            ? field
                .required()
                .oneOf(
                  [Yup.ref('password')],
                  'Password does not match the confirm password'
                )
            : field
        ),
      });

      schema.validate(req.body).catch(err => {
        return res.status(400).json({ error: err.errors[0] });
      });

      //Recebo userId do token e consulto usuario
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      //Recebe valores do body da requisição
      const { email, oldPassword, password, confirPassword } = req.body;

      //Verifica o email
      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email: email } });

        if (userExists) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
      }

      //Verifica alteração de senha
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      //Caso passar uma nova senha tem que passar a senha antiga também
      if (password && !oldPassword) {
        return res.status(401).json({ error: 'Old Password is required' });
      }

      //Realiza o update
      const { id, name, email: userEmail } = await user.update(req.body);

      return res.json({ id, name, email: userEmail });
    } catch (err) {
      return res.status(500).json({ error: 'Update user failed, try again' });
    }
  }
}

export default new UserController();
