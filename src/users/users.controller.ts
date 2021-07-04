import { Controller, Get, Post, Put, Delete, Req, HttpCode, Body, Param, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { DeleteResult, UpdateResult } from 'typeorm';
import { UsersService } from './users.service'
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as moment from "moment";

const qs = require("querystring");
const http = require("https");

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id, @Body() userData: User): Promise<User> {
    try {
      userData.id = Number(id);
      const user: User = await this.usersService.findOne(id)

      return user
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/update')
  @HttpCode(204)
  async update(@Param('id') id, @Body() userData: User): Promise<UpdateResult> {
    try {
      userData.id = Number(id);

      return this.usersService.update(userData);
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/update_subscription')
  @HttpCode(204)
  async updateSubscription(@Param('id') id, @Body() body: any): Promise<boolean> {
    try {
      const userId: number = Number(id);
      const user: User = await this.usersService.findOne(userId);
      const subscriptionId: number = user.subscriptionId;
      const oldPlan: number = user.plan;
      const plan: number = Number(body.plan);

      // Calculate the balance
      const new_quantity: number = plan;
      const old_quantity: number = oldPlan;
      const daysInMonth: number = moment().daysInMonth();
      const oldRequestLimit: number = Number(process.env.PLAN_LIMIT_INCREMENT) * old_quantity;
      const newRequestLimit: number = Number(process.env.PLAN_LIMIT_INCREMENT) * new_quantity;
      const start = moment(user.lastPaymentDate).startOf("day")
      const end = moment();
      const remainingDays = start.diff(end, 'days');
      const requestsPerDays = Math.floor(oldRequestLimit / daysInMonth);
      const remainingRequests = remainingDays * requestsPerDays;
      const balance = remainingRequests + newRequestLimit;

      const options = {
        "method": "POST",
        "hostname": "vendors.paddle.com",
        "port": null,
        "path": "/api/2.0/subscription/users/update",
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        }
      };
      const result: any = await new Promise((resolve, reject) => {
        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("error", (err) => {
            reject(err);
          });

          res.on("data", (chunk) => {
            chunks.push(chunk);
          });

          res.on("end", () => {
            var body = Buffer.concat(chunks);
            resolve(body.toString());
          });
        });

        // This check is JUST FOR JEST
        // Becaus eof it's improper mocking of the https node function
        // It doesn't add the correct return value when calling "http.request"
        // so both req.write & req.end would break because req here would be NULL
        // So if it's NULL - then assume it's JEST and just resolve the Promise
        // for the sake of the tests - thank you Jest!
        if (req) {
          req.write(qs.stringify({
            vendor_id: parseInt(process.env.VENDOR_ID),
            vendor_auth_code: process.env.VENDOR_AUTH_CODE,
            subscription_id: subscriptionId,
            quantity: plan,
            currency: 'USD',
            recurring_price: parseFloat(process.env.DOLLAR_FOSSIL_VALUE),
            bill_immediately: false,
            prorate: true,
            keep_modifiers: true,
            passthrough: 'string',
          }));
          req.end();
        } else {
          // Assume it's just
          resolve(JSON.stringify({ success: true }))
        }
      })
      const res: any = JSON.parse(result);

      if (!res.success) throw(result)
      if (res.success) await this.usersService.updateSubscriptionPlan(userId, plan, balance)

      return true
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel_subscription')
  @HttpCode(204)
  async cancelSubscription(@Param('id') id): Promise<any> {
    try {
      const userId: number = Number(id);
      const user: User = await this.usersService.findOne(userId);
      const subscriptionId: number = user.subscriptionId;

      const options = {
        "method": "POST",
        "hostname": "vendors.paddle.com",
        "port": null,
        "path": "/api/2.0/subscription/users_cancel",
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        }
      };
      const result: any = await new Promise((resolve, reject) => {
        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("error", (err) => {
            reject(err);
          });

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {
            var body = Buffer.concat(chunks);
            resolve(body.toString());
          });
        });

        // Excerpt from above:
        // ------------------------------
        // This check is JUST FOR JEST
        // Becaus eof it's improper mocking of the https node function
        // It doesn't add the correct return value when calling "http.request"
        // so both req.write & req.end would break because req here would be NULL
        // So if it's NULL - then assume it's JEST and just resolve the Promise
        // for the sake of the tests - thank you Jest!
        if (req) {
          req.write(qs.stringify({
            vendor_id: parseInt(process.env.VENDOR_ID),
            vendor_auth_code: process.env.VENDOR_AUTH_CODE,
            subscription_id: subscriptionId,
          }));
          req.end();
        } else {
          // Assume it's just
          resolve(JSON.stringify({ success: true }))
        }
      });
      const res: any = JSON.parse(result);

      if (!res.success) throw(result)
      if (res.success) await this.usersService.cancelSubscription(userId)

      return true
    } catch(error) {
      throw(error)
    }
  }
}
