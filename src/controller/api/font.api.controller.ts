import {execSync} from 'child_process';
import { Request, Response, Router } from "express";
import { Controller } from "../../interfaces/controller.interface";

class FontApiController implements Controller {
  PATH = "/api/font";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.put(this.PATH, this.create);
    this.router.get(this.PATH, this.get)
  }

  private get = (_request: Request, response: Response): void => {
    console.log('Hello there');
    response.download(`${process.cwd()}/example.ttf`);
  }

  private create = (_request: Request, response: Response): void => {
      execSync('/usr/bin/python svgs2ttf.py metadata.json');
      response.sendStatus(200);
  };  
} 

export default FontApiController;
