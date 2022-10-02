import { promises as fsPromises } from 'fs';
import { Request, Response, Router } from 'express';
import { Query } from 'express-serve-static-core';
import { Controller } from '../../interfaces/controller.interface';

interface TypedRequestQuery<T extends Query> extends Request {
  query: T;
}

class GlyphApiController implements Controller {
  PATH = '/api/glyph';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.put(this.PATH, this.create);
    this.router.get(this.PATH, this.get);
  }

  private get = async (
    request: TypedRequestQuery<{ unicode: string }>,
    response: Response
  ): Promise<void> => {
    const { unicode } = request.query;

    const result = await fsPromises
      .readFile(`${process.cwd()}/src/svg/${unicode}.svg`)
      .catch((err) => {
        console.error(err);
        response.sendStatus(404);
        return;
      });

    response.send(result);
  };

  private create = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { unicode, svg } = request.body;
    const charCode = `0x${unicode.charCodeAt(0).toString(16)}`;
    const metaDataFile = `${process.cwd()}/metadata.json`;
    const dataString = await fsPromises.readFile(metaDataFile, 'utf8');
    const data = JSON.parse(dataString);
    data.glyphs[charCode] = {
      src: `${unicode}.svg`,
    };
    fsPromises.writeFile(metaDataFile, JSON.stringify(data));
    fsPromises
      .writeFile(`${process.cwd()}/src/svg/${unicode}.svg`, svg)
      .catch((err) => {
        response.sendStatus(500);
        console.error(err);
        return;
      });

    response.sendStatus(201);
  };
}

export default GlyphApiController;
