import User from "../models/user.model.js"


class UserRepository {

  async getById(user_id) {
    return await User.findById(user_id)
  }

  async getByEmail(email) {
    return await User.findOne({email})
  }

  async getByPhone(phone) {
    return await User.findOne({phone})
  }

    async updateById(user_id, update_data) {
    await User.findByIdAndUpdate(user_id, update_data)
  }

  async create(contuser_dataactData) {
    return await User.create(user_data)
  }

  async deleteById(user_id) {
    return await User.findByIdAndDelete(user_id)
  }

  async updateLastSeen(user_id) {
    return await User.findByIdAndUpdate(
      user_id, 
      {last_seen: new Date()},
      {new: true}
    )
  }
  async setOnline(userId){
    return await User.findByIdAndUpdate(
      user_id,
      {online: true},
      {new: true} 
    )
  }
  async setOffline(userId){
    return await User.findByIdAndUpdate(
      user_id,
      {online: false},
      {new: true} 
    )
  }
}

const userRepository = new UserRepository
export default userRepository
