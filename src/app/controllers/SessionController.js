import User from '../models/User';
import * as Yup from 'yup';

class SessionController {
  //Cria sessão e retorna token
  async store(req, res) {
    try {
      //Validação de entrada de dados =================
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required(),
      });

      schema.validate(req.body).catch(err => {
        res.status(400).json({ error: err.errors[0] });
      });
      //Fim da validação de entrada de dados ==========

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      //Caso usuario não existir
      if (!user) {
        return res.status(400).json({ error: 'User not exists' });
      }

      //Caso senha não for igual a cadastrada
      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'Password does not password' });
      }

      const { id, name, provider } = user;

      //Gera token passando id no payload
      const token = user.tokenGenerate();

      //Retorna usuario e token
      return res.json({ user: { id, name, email, provider }, token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: 'Failed authentication, try again' });
    }
  }
}

export default new SessionController();
