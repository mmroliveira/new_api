import { request, Request, Response, Router } from "express";
import multer from "multer";
import { multerConfig } from "./configs/multer";

import { UserController } from "./controllers/users";
import { CountriesController } from "./controllers/countries";
import { ReceiptsController } from "./controllers/receipts";
import { StatesController } from "./controllers/states";
import { CitiesController } from "./controllers/cities";
import { TypeController } from "./controllers/type";
import { SuppliersController } from "./controllers/suppliers";
import { CompaniesController } from "./controllers/companies";
import { StatusController } from "./controllers/status";
import { CurrencyController } from "./controllers/currency";
import { NatureController } from "./controllers/nature";
import { CostCenterController } from "./controllers/costCenter";

import { ensureAuthenticateUser } from "./middlewares/authenticate";

const router = Router();

const userController = new UserController();
const countriesController = new CountriesController();
const receiptsController = new ReceiptsController();
const statesController = new StatesController();
const citiesController = new CitiesController();
const typeController = new TypeController();
const suppliersController = new SuppliersController();
const companiesController = new CompaniesController();
const statusController = new StatusController();
const currencyController = new CurrencyController();
const natureController = new NatureController();
const costCenterController = new CostCenterController();

router.post("/user/create/", userController.create);
router.post("/user/authenticate/", userController.authenticate);

router.get("/countries", countriesController.list);
router.post("/countries/create", countriesController.create);

router.get("/cities", citiesController.list);
router.get("/cities/:id", citiesController.listByStateId);
router.post("/cities/create", citiesController.create);

router.get("/states", statesController.list);
router.post("/states/create", statesController.create);

router.get("/type", typeController.list);
router.post("/type/create", typeController.create);

router.get("/suppliers", suppliersController.list);
router.get("/suppliers/:supplier_id", suppliersController.get);
router.delete("/suppliers/delete/:supplier_id", suppliersController.delete);
router.post("/suppliers/create", multer(multerConfig).single("file"), suppliersController.create);
router.put("/suppliers/update/:supplier_id", multer(multerConfig).single("file"), suppliersController.update);

router.get("/companies", companiesController.list);
router.post("/companies/create", companiesController.create);

router.get("/status", statusController.list);
router.post("/status/create", statusController.create);

router.get("/receipts/", receiptsController.list);
router.get("/receipts/:id", receiptsController.get);
router.get("/receipts/view/:receipt_id", receiptsController.view);
router.post("/receipts/create/", receiptsController.create);
router.put("/receipts/update/:receipt_id", receiptsController.update);
router.delete("/receipts/delete/:receipt_id", receiptsController.delete);

router.get("/currency", currencyController.list);
router.get("/currency/:currency_id", currencyController.get);
router.get("/nature", natureController.list);
router.get("/cost_center", costCenterController.list);

export { router };
