import { Request, Response } from "express";
import { database } from "../../database/connection";

import * as yup from "yup";
import fs from "fs";

import azure from "azure-storage";

export interface ISuppliers {
  supplier_id?: number;
  fk_type_id: number;
  register: string;
  name: string;
  fantasy_name?: string;
  fk_country_id?: number;
  fk_state_id?: number;
  fk_city_id?: number;
  street?: string;
  neighborhood?: string;
  number?: string;
  zip_code?: string;
  phone?: string;
  cell?: string;
  state_registration?: string;
  logo_url?: string;
}

export class SuppliersController {
  async create(request: Request, response: Response) {
    //  pegando os valores do request e
    //  transformando os 'null' em null
    let values = request.body;

    for (let key in values) {
      if (values[key] === "null") {
        values[key] = null;
      }
    }

    // definicão do objeto de validação
    const schema = yup.object().shape({
      fk_type_id: yup.number().required("The type field must be filled"),
      register: yup.string().required("The Registration field must be filled"),
      name: yup.string().required("The Name field must be filled"),
    });

    // tentando fazer a validação dos dados
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const allErrors = error.inner.reduce(
        (errors, currentValidation) =>
          Object.assign(errors, {
            [currentValidation.path]: currentValidation.errors[0], //first error is enough for this demo
          }),
        {}
      );

      return response.status(400).json(allErrors);
    }

    // verificando se o fornecedor já está cadastrado
    try {
      const [supplierExists] = await database
        .select("*")
        .from<ISuppliers>("suppliers")
        .where({ register: values.register });

      if (supplierExists) {
        return response
          .status(400)
          .json({ message: "Supplier already exists" });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal server error" });
    }

    // variável declarada aqui para caso o usuário não inclua uma foto

    let photo_url = null;

    // verificação pra saber se o usuário incluiu uma foto
    if (request.file) {
      // carregando a imagem que foi salva pelo multer
      const photo = fs.readFileSync(request.file.path);

      // filename utilizado para não confundir
      let filename = request.file.filename;

      // gravando a imagem no azure
      try {
        // fazendo a conexão com o azure
        const blobService = azure.createBlobService(
          process.env.AZURE_STORAGE_CONNECTION_STRING
        );

        blobService.deleteBlobIfExists(
          "suppliers",
          "https://globalmax.blob.core.windows.net/suppliers/102c957a6dac23ef27a176d9aa1d12e7-278990923_821581009247672_8635737171494939845_n.jpeg",
          (error) => {
            if (error) {
              response.send({ Grrr: error });
            }
          }
        );

        // fazendo o upload da imagem no azure
        blobService.createBlockBlobFromText(
          "suppliers",
          filename,
          photo,
          (error) => {
            if (error) {
              response.send({ Grrr: error });
            }
          }
        );
      } catch (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: error, msg: "erro ao salvar imagem no azure" });
      }

      // construindo a url da imagem que foi gerada pelo azure
      photo_url = `https://globalmax.blob.core.windows.net/suppliers/${filename}`;
    }

    // tentando cadastrar o fornecedor no banco de dados;
    try {
      const [result] = await database("suppliers")
        .insert({
          fk_type_id: values.fk_type_id,
          register: values.register,
          name: values.name,
          fantasy_name: values.fantasy_name,
          fk_country_id: values.fk_country_id,
          fk_state_id: values.fk_state_id,
          fk_city_id: values.fk_city_id,
          street: values.street,
          neighborhood: values.neighborhood,
          number: values.number,
          zip_code: values.zip_code,
          phone: values.phone,
          cell: values.cell,
          state_registration: values.state_registration,
          logo_url: photo_url,
        })
        .returning("*");

      return response
        .status(200)
        .json({ result: result, message: "supplier registered successfully" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: error, message: "Pohaaa deu ruim" });
    }
  }

  async update(request: Request, response: Response) {
    const { supplier_id } = request.params;
    let supplierExists;

    //  pegando os valores do request e
    //  transformando os 'null' em null
    let values = request.body;

    for (let key in values) {
      if (values[key] === "null") {
        values[key] = null;
      }
    }

    // definicão do objeto de validação
    const schema = yup.object().shape({
      fk_type_id: yup.number().required("The type field must be filled"),
      register: yup.string().required("The Registration field must be filled"),
      name: yup.string().required("The Name field must be filled"),
    });

    // tentando fazer a validação dos dados
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      const allErrors = error.inner.reduce(
        (errors, currentValidation) =>
          Object.assign(errors, {
            [currentValidation.path]: currentValidation.errors[0],
          }),
        {}
      );

      return response.status(400).json(allErrors);
    }

    // verificando se o fornecedor existe
    try {
      [supplierExists] = await database
        .select("*")
        .from("suppliers")
        .where({ supplier_id: supplier_id });

      if (!supplierExists) {
        return response
          .status(400)
          .json({ keee: supplierExists, message: "Supplier does not exists" });
      }

      const [registerExists] = await database
        .select("*")
        .from("suppliers")
        .where({ register: request.body.register })
        .whereNot({ supplier_id: supplier_id });

      if (registerExists) {
        return response
          .status(400)
          .json({ message: "Registeris already registered" });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal server error" });
    }

    // variável declarada aqui para caso o usuário não inclua uma foto
    let photo_url = supplierExists.photo_url;

    // verificação pra saber se o usuário incluiu uma foto
    if (request.file) {
      // carregando a imagem que foi salva pelo multer
      const photo = fs.readFileSync(request.file.path);

      // filename utilizado para não confundir
      let filename = request.file.filename;

      // gravando a imagem no azure
      try {
        // fazendo a conexão com o azure
        const blobService = azure.createBlobService(
          process.env.AZURE_STORAGE_CONNECTION_STRING
        );

        // verificando se a imagem alterou
        if (supplierExists.logo_url !== null) {
          let po = supplierExists.logo_url as string;
          po = po.replace(
            "https://globalmax.blob.core.windows.net/suppliers/",
            ""
          );

          if (po !== filename) {
            blobService.deleteBlobIfExists("suppliers", po, (error) => {
              if (error) {
                response.send({ Grrr: error });
              }
            });
          }
        }

        // fazendo o upload da imagem no azure
        blobService.createBlockBlobFromText(
          "suppliers",
          filename,
          photo,
          (error) => {
            if (error) {
              response.send({ Grrr: error });
            }
          }
        );
      } catch (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: error, msg: "erro ao salvar imagem no azure" });
      }

      // construindo a url da imagem que foi gerada pelo azure
      photo_url = `https://globalmax.blob.core.windows.net/suppliers/${filename}`;
    }

    // tentando atualizar o fornecedor no banco de dados;
    try {
      const [result] = await database("suppliers")
        .where({ supplier_id: supplier_id })
        .update({
          fk_type_id: values.fk_type_id,
          register: values.register,
          name: values.name,
          fantasy_name: values.fantasy_name,
          fk_country_id: values.fk_country_id,
          fk_state_id: values.fk_state_id,
          fk_city_id: values.fk_city_id,
          street: values.street,
          neighborhood: values.neighborhood,
          number: values.number,
          zip_code: values.zip_code,
          phone: values.phone,
          cell: values.cell,
          state_registration: values.state_registration,
          logo_url: photo_url,
        })
        .returning("*");

      return response
        .status(200)
        .json({ result: result, message: "supplier registered successfully" });
    } catch (error) {
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const result = await database
        .select("suppliers.*", "c.name as city", "s.abbreviation as state")
        .orderBy("supplier_id", "asc")
        .from("suppliers")
        .where({ active_supplier: true })
        .leftJoin("cities as c", "fk_city_id", "c.city_id")
        .leftJoin("states as s", "suppliers.fk_state_id", "s.state_id");

      return response.json(result);
    } catch (error) {
      return response.handleError("Internal server error", 500);
    }
  }

  async get(request: Request, response: Response) {
    try {
      const { supplier_id } = request.params;

      const result = await database
        .select(
          "suppliers.*",
          "city.name as city",
          "state.abbreviation as state",
          "country.name as country",
          "t.name as type"
        )
        .orderBy("supplier_id", "asc")
        .from("suppliers")
        .where({ active_supplier: true, supplier_id: supplier_id })
        .leftJoin("cities as city", "fk_city_id", "city.city_id")
        .leftJoin("countries as country", "fk_country_id", "country.country_id")
        .leftJoin("states as state", "suppliers.fk_state_id", "state.state_id")
        .leftJoin("type as t", "fk_type_id", "t.type_id");

      return response.json(result);
    } catch (error) {
      return response.status(500).json({ message: "Internal server erroree" });
    }
  }

  async delete(request: Request, response: Response) {
    // pegando o id da requisição
    const { supplier_id } = request.params;

    // definindo a validação do id
    const schema = yup.object().shape({
      supplier_id: yup.number().integer(),
    });

    // tentando fazer a validação
    try {
      await schema.validate(request.params);
    } catch (error) {
      return response
        .status(400)
        .json({ validate: false, message: error.errors });
    }

    // verificando se o fornecedor existe
    try {
      const [supplierExists] = await database
        .select("*")
        .from("suppliers")
        .where({ supplier_id: supplier_id });

      if (!supplierExists) {
        return response.status(400).json({
          message: "Supplier not exists",
        });
      }

      if (supplierExists.active_supplier === false) {
        return response.status(202).json({
          message: "provider has already been deleted",
        });
      }
    } catch (error) {
      console.log(error);
      return response
        .status(400)
        .json({ validate: false, message: "Internal error server" });
    }

    // fazendo a exclusão
    try {
      const [result] = await database("suppliers")
        .update({ active_supplier: false })
        .where({ supplier_id: supplier_id })
        .returning("*");

      return response.status(200).json({ result });
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: "Internal error server" });
    }
  }
}
