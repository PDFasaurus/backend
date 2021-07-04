import { Controller, Get, Post, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { TemplatesService } from './templates.service'
import { Template } from './template.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ICreateTemplate } from '../lib/create-template';
import { IUpdateTemplate } from '../lib/update-template';
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import Handlebars from 'handlebars';
import * as pdf from 'html-pdf';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request: Request): Promise<Template[]> {
    try {
      const req: any = request;
      const requestUser: any = req.user;
      const userId: number = requestUser.user;
      const user: Partial<User> = { id: userId };
      const templates: Template[] = await this.templatesService.findAll(user)

      return templates
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id, @Body() templateData: Template): Promise<Template> {
    try {
      templateData.id = Number(id);
      const template: Template = await this.templatesService.findOne(id)

      return template
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() values: any): Promise<Template> {
    try {
      const templateData: ICreateTemplate = {
        name: values.name,
        content: '<html><head></head><body>Go go dino-rangers! Add values like a {{name}} with the API!</body></html>',
        uuid: uuidv4(),
        user: { id: 1 },
      }

      // Get the new template
      return await this.templatesService.create(templateData);
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id, @Body() values: any): Promise<UpdateResult> {
    try {
      const templateData: IUpdateTemplate = {
        id: Number(id),
        name: values.name,
        content: values.content,
        deleted: values.deleted,
      }

      return this.templatesService.update(templateData);
    } catch(error) {
      throw(error)
    }
  }

  @Get(':id/preview')
  async preview(
    @Param('id') id,
    @Res() res,
    @Req() req: Request
  ): Promise<any> {
    try {
      const { query: { values } } = req;
      const templateId: string = id
      const templateValues: string = String(values)
      const template: Template = await this.templatesService.findOne(templateId);
      const parsedValues: any = JSON.parse(templateValues)
      const compiledTemplate = Handlebars.compile(template.content);
      const html = compiledTemplate(parsedValues);

      pdf.create(html).toStream((err, stream) => {
        if (err) throw(err)
        res.header('Content-type', 'application/pdf');
        stream.pipe(res);
      });
    } catch(error) {
      throw(error)
    }
  }
}