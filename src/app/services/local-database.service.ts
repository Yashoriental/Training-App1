// import { Injectable } from '@angular/core';
// import { Storage } from '@ionic/storage-angular';

// @Injectable({
//   providedIn: 'root'
// })
// export class LocalDatabaseService {
//   private _storage: Storage | null = null;

//   constructor(private storage: Storage) {
//     this.init();
//   }

//   // 1️⃣ Initialize Storage
//   async init() {
//     const storage = await this.storage.create();
//     this._storage = storage;
//   }

//   async setUserData(userData: any) {
//     await this._storage?.set('userData', userData);
//     console.log('User data saved locally.');
//   }

//   async getUserData() {
//     const data = await this._storage?.get('userData');
//     return data;
//   }

//   // Optional: Remove userData
//   async removeUserData(): Promise<void> {
//     await this._storage?.remove('userData');
//   }
// }
