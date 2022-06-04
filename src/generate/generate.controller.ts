import { Controller, Get, Post, Put, Delete, Req, HttpCode, Body, Param, Headers, Res } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'
import { Template } from '../templates/template.entity';
import { TemplatesService } from '../templates/templates.service';
import { Request } from '../requests/request.entity';
import { RequestsService } from '../requests/requests.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import Handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import { ICreateRequest } from '../lib/create-request';
import axios from "axios";
import * as moment from "moment";

@Controller('dino')
export class GenerateController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly requestsService: RequestsService,
    private readonly usersService: UsersService
  ) {
    // This is to test / debug
    // this.test()
  }

  async test() {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://localhost:3000/dino/9ce0dbea-f8ec-4684-bff7-72e149832c14',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'afb05112-ebf5-44f4-8580-9d729a14b42a',
        },
        responseType: 'stream',
        data: {
          name: 'Johannes'
        }
      })

      console.log(res)
    } catch (e) {
      console.log(e.message)
    }
  }

  @Post(':uuid')
  async generate(
    @Res() res,
    @Param('uuid') uuid,
    @Body() values: any,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    try {
      if (!authorization) throw('No header')
      const apiKey: string = String(authorization);
      const user: User = await this.usersService.findOneWithApiKey(apiKey);
      if (!user) throw('No user found');
      const template: Template = await this.templatesService.findOneWithUuid(uuid);
      if (!template) throw('No template found');
      const { width, height } = template;
      const parsedValues: any = typeof values == "string" ? JSON.parse(values) : values;
      const compiledTemplate = Handlebars.compile(template.content);
      const html = compiledTemplate(parsedValues);
      const start = moment(user.lastPaymentDate).startOf("day").format("YYYY-MM-DD H:mm:ss");
      const end = moment(user.lastPaymentDate).add(1, "months").endOf("day").format("YYYY-MM-DD H:mm:ss");
      const { count } = await this.requestsService.totalForMonth(start, end);
      const totalCurrentMonth: any = count;
      const request: ICreateRequest = {
        apiKey,
        template,
        user,
      };

      // Limit them
      if (totalCurrentMonth > user.balance) {
        return res.status(403).send({ message: "limit exceeded" })
      }

      // Log the request
      await this.requestsService.create(request)

      // Create the stream
      pdf.create(html, { height: height + "mm", width: width + "mm" }).toStream((err, stream) => {
        if (err) throw(err)
        res.header('Content-type', 'application/pdf');
        stream.pipe(res);
      });

      return true
    } catch(error) {
      throw(error)
    }
  }

  @Post(':uuid/base64')
  async generateBase64(
    @Res() res,
    @Param('uuid') uuid,
    @Body() values: any,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    try {
      if (!authorization) throw('No header')
      const apiKey: string = String(authorization);
      const user: User = await this.usersService.findOneWithApiKey(apiKey);
      if (!user) throw('No user found');
      const template: Template = await this.templatesService.findOneWithUuid(uuid);
      if (!template) throw('No template found');
      const { width, height } = template;
      const parsedValues: any = typeof values == "string" ? JSON.parse(values) : values;
      const compiledTemplate = Handlebars.compile(template.content);
      const html = compiledTemplate(parsedValues);
      const start = moment(user.lastPaymentDate).startOf("day").format("YYYY-MM-DD H:mm:ss");
      const end = moment(user.lastPaymentDate).add(1, "months").endOf("day").format("YYYY-MM-DD H:mm:ss");
      const { count } = await this.requestsService.totalForMonth(start, end);
      const totalCurrentMonth: any = count;
      const request: ICreateRequest = {
        apiKey,
        template,
        user,
      };

      // Limit them
      if (totalCurrentMonth > user.balance) {
        return res.status(403).send({ message: "limit exceeded" })
      }

      // Log the request
      await this.requestsService.create(request)

      // Create teh buffer
      const buffer: Buffer = await new Promise((resolve, reject) => {
        pdf.create(html, { height: height + "mm", width: width + "mm" }).toBuffer((err, buffer) => {
          if (err) reject(err);

          resolve(buffer);
        });
      });

      return res.send({
        data: buffer.toString('base64'),
        type: 'base64'
      })
    } catch(error) {
      throw(error)
    }
  }

  @Post(':uuid/buffer')
  async generateBuffer(
    @Res() res,
    @Param('uuid') uuid,
    @Body() values: any,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    try {
      if (!authorization) throw('No header')
      const apiKey: string = String(authorization);
      const user: User = await this.usersService.findOneWithApiKey(apiKey);
      if (!user) throw('No user found');
      const template: Template = await this.templatesService.findOneWithUuid(uuid);
      if (!template) throw('No template found');
      const { width, height } = template;
      const parsedValues: any = typeof values == "string" ? JSON.parse(values) : values;
      const compiledTemplate = Handlebars.compile(template.content);
      const html = compiledTemplate(parsedValues);
      const start = moment(user.lastPaymentDate).startOf("day").format("YYYY-MM-DD H:mm:ss");
      const end = moment(user.lastPaymentDate).add(1, "months").endOf("day").format("YYYY-MM-DD H:mm:ss");
      const { count } = await this.requestsService.totalForMonth(start, end);
      const totalCurrentMonth: any = count;
      const request: ICreateRequest = {
        apiKey,
        template,
        user,
      };

      // Limit them
      if (totalCurrentMonth > user.balance) {
        return res.status(403).send({ message: "limit exceeded" })
      }

      // Log the request
      await this.requestsService.create(request)

      // Create teh buffer
      const buffer: Buffer = await new Promise((resolve, reject) => {
        pdf.create(html, { height: height + "mm", width: width + "mm" }).toBuffer((err, buffer) => {
          if (err) reject(err);

          resolve(buffer);
        });
      });

      return res.send(buffer)
    } catch(error) {
      throw(error)
    }
  }
}
