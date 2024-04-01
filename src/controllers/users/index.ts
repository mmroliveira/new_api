import { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import { database } from "../../database/connection";
import uniqid from "uniqid";

import fs from "fs";



interface IUsers {
  user_id: string;
  user_name: string;
  password: string;
  name: string;
  cpf: string;
  pis: string;
  occupation: string;
  birth_date: string;
  admission_date: string;
  photo_url: string;
  active_user: boolean;
  created_at: Date;
}

export class UserController {
  async create(request: Request, response: Response) {
    const {
      user_name,
      password,
      name,
      cpf,
      pis,
      occupation,
      birth_date,
      admission_date,
    } = request.body;

    // a parte de validação dos dados com yup

    // verificando se o usuario já existe
    try {
      const [userExists] = await database
        .select("*")
        .from<IUsers>("users")
        .where({
          user_name: user_name,
        });

      if (userExists) {
        return response.handleError("User already exists", 400);
      }
    } catch (error) {
      console.log(error);
      return response.handleError("Internal server error", 500);
    }

    // Criptografar a senha
    //const hashPassword = await hash(password, 10);

    // gerando um id pro usuário
    const user_id = uniqid();

    // carregando a imagem que foi salva pelo multer
    //const photo = fs.readFileSync(request.file.path);

    // filename utilizado para não confundir
    //let filename = request.file.filename;

    // gravando a imagem no azure
    //try {
      // fazendo a conexão com o azure
    //  const blobService = azure.createBlobService(
    //    process.env.AZURE_STORAGE_CONNECTION_STRING
    //  );

      // fazendo o upload da imagem no azure
    //   blobService.createBlockBlobFromText("users", filename, photo, (error) => {
    //     if (error) {
    //       response.send({ Grrr: error });
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return response
    //     .status(500)
    //     .json({ error: error, msg: "erro ao salvar imagem no azure" });
    // }

    // construindo a url da imagem que foi gerada pelo azure
    // const photo_url = `https://globalmax.blob.core.windows.net/users/${filename}`;

    // Salvando no banco de dados o usuario
    try {
      await database("users").insert({
        user_id: user_id,
        user_name: user_name,
        password: password,
        name: name,
        cpf: cpf,
        pis: pis,
        occupation: occupation,
        birth_date: birth_date,
        admission_date: admission_date,
        photo_url: "",
      });

      return response.json({ message: "User registered successfully" });
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }

  async authenticate(request: Request, response: Response) {
    const { user_name, password } = request.body;

    try {
      const [user] = await database.select("*").from<IUsers>("users").where({
        user_name: user_name,
      });

      if (user === null) {
        return response.handleError("Username or password invalid!", 400);
      }

      const jwtSecret = process.env.JWT_SECRET;

      //const passwordMatch = await compare(password, user.password);

      //if (passwordMatch === false) {
      //  return response.handleError("Username or password invalid!", 400);
      //}

      //const token = sign({ user_name }, jwtSecret, {
      //  subject: user.user_id,
      //  expiresIn: "1d",
      //});

      return response.json({
        user: {
          name: user.name,
          user_name: user.user_name,
          user_id: user.user_id,
          photo_url: user.photo_url,
        },
        //token: token,
      });
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }
}
