import { Injectable, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  getCredentials(): any {
    const SCOPES = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.file',
    ];
    const jwt = new JWT({
      email: '',
      key: '',
      scopes: SCOPES,
    });
    const res = new GoogleSpreadsheet('GET GOOGLE SHEET ID', jwt);
    return res;
  }
  sayHello(): string {
    return 'Hello this is testing user route.';
  }

  async createUser(): Promise<User> {
    const nameF = faker.person.fullName();
    const email = nameF.split(' ').join('_') + '@gmail.com';
    const age = getAge();
    const postalCode = getRandomPostal();
    const phoneNumber = generatePhone();
    function getAge() {
      const aget = Math.floor(Math.random() * (70 - 18) + 18);
      if (aget <= 17) {
        getAge();
      } else {
        return aget;
      }
    }
    function getRandomPostal() {
      const aget = Math.floor(Math.random() * (999999 - 100000) + 100000);
      if (aget <= 99999) {
        getRandomPostal();
      } else {
        return aget;
      }
    }
    function generatePhone() {
      const aget = Math.floor(Math.random() * (99999 - 80000) + 80000);
      const bget = Math.floor(Math.random() * (99999 - 80000) + 80000);
      if (bget <= 80000 || aget <= 80000) {
        generatePhone();
      }
      return `+91${aget}${bget}`;
    }

    const u1 = {
      id: Math.floor(Math.random() * 10000),
      name: nameF,
      age: age ? age : 32,
      email: email,
      phone: phoneNumber ? phoneNumber : '+919887654321',
      postalCode: postalCode ? postalCode : '700100',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const createDocumet = new this.userModel(u1);
    return createDocumet.save();
  }

  async readUsers(): Promise<User[]> {
    const users = await this.userModel.find().sort('id');
    const usersArr = [];
    for (const j of users) {
      usersArr.push({
        id: j.id,
        name: j.name,
        email: j.email,
        phone: j.phone,
        postalCode: j.postalCode,
      });
    }
    const res = await this.getCredentials();
    await res.loadInfo();
    const firstSheet = res.sheetsByIndex[0];
    await firstSheet.setHeaderRow([
      'id',
      'name',
      'email',
      'phone',
      'postalCode',
    ]);
    await firstSheet.addRows(usersArr);
    return users;
  }

  async updateUser(): Promise<any> {
    const res = await this.getCredentials();
    await res.loadInfo();
    const firstSheet = res.sheetsByIndex[1];
    const sheetVals = await firstSheet.getRows();
    const arr = [];
    const headers = sheetVals[0]['_worksheet']['_headerValues'];
    for (const j of sheetVals) {
      const rawData = j['_rawData'];
      const obj = {};
      for (const j in rawData) {
        obj[headers[j]] = rawData[j];
      }
      arr.push(obj);
    }
    for (const j of arr) {
      try {
        const res = await this.userModel.findOneAndUpdate(
          { email: { $eq: j.email } },
          j,
          {
            new: true,
          },
        );
        console.log(res);
      } catch (err) {
        console.log('Some error occured! Please try again later.');
        return 'Some error occured';
      }
    }
    await firstSheet.clearRows();
    return 'data updated successfully';
  }

  async deleteUser() {
    const res = await this.getCredentials();
    await res.loadInfo();
    const firstSheet = res.sheetsByIndex[2];
    const sheetVals = await firstSheet.getRows();
    for (const j of sheetVals) {
      const uid = Number(j['_rawData'][0]);
      try {
        const res = await this.userModel.findOneAndDelete({
          id: { $eq: uid },
        });
        console.log(res);
      } catch (err) {
        console.log('Some error occured! Please try again later.');
        return 'Some error occured';
      }
    }
    return 'data updated successfullyd';
  }
}
