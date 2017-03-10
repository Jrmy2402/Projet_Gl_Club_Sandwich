/**
 * name
 */
export class UserModel {
  user : any = {}

  constructor() {}

  getUser (){
    return this.user;
  }

  setUser (user) {
    this.user = Object.assign({}, user);
  }
}