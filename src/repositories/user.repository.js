import User from "../models/user.model.js"


class UserRepository {

  async getById(userId) {
    return await User.findById(userId)
  }

  async getByEmail(email) {
    return await User.findOne({email})
  }

  async getByPhone(phone) {
    return await User.findOne({phone})
  }

    async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId, 
      updateData, 
      {returnDocument: 'after'})
  }

  async create(userData) {
    return await User.create(userData)
  }

  async deleteById(userId) {
    return await User.findByIdAndDelete(userId)
  }

  async updateLastSeen(userId) {
    return await User.findByIdAndUpdate(
      userId, 
      {last_seen: new Date()},
      {returnDocument: 'after'}
    )
  }
  async setOnline(userId){
    return await User.findByIdAndUpdate(
      userId,
      {online: true},
      {returnDocument: 'after'} 
    )
  }
  async setOffline(userId){
    return await User.findByIdAndUpdate(
      userId,
      {online: false},
      {returnDocument: 'after'} 
    )
  }
}

const userRepository = new UserRepository
export default userRepository
