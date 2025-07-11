import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx'

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private dbInstance!: SQLiteObject;
  constructor(private sqlite: SQLite) { }

  async createDatabase() {
    this.dbInstance = await this.sqlite.create({
      name: 'userdata.db',
      location: 'default',
  });
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
         firstName TEXT,
         lastName TEXT,
         email TEXT PRIMARY KEY,
         contact TEXT,
         dob TEXT,
         country TEXT,
         gender TEXT,
         password TEXT,
         terms TEXT
       )`,
       []
    );
  }

  async insertuser(user: any){
    const sql = 'INSERT INTO users(firstName, lastName, email, contact, dob, country, gender, password, terms) VALUES (?,?,?,?,?,?,?,?,?)';
    const parms = [user.firstName, user.lastName, user.email, user.contact, user.dob, user.country, user.gender, user.password, user.terms]
    try {
    await this.dbInstance.executeSql(sql, parms);
    return { success: true };
  } catch (err: any) {
    if (err.message.includes('UNIQUE') || err.message.includes('PRIMARY')) {
      return { success: false, error: 'Email already exists' };
    }
    return { success: false, error: 'Insertion Error' };
  }
  }
  async getAllUser(): Promise<any[]>{
    const res = await this.dbInstance.executeSql('SELECT * FROM users',[]);
    let users = [];
    for(let i=res.rows.length-1; i<res.rows.length; i++){
      const user = res.rows.item(i);
      user.password = '*'.repeat(user.password.length);
      users.push(user);
    }
    return users;
  }
}

