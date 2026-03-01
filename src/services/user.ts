import { UpdateUserType, UserInsert } from "../schemas/auth.js"
import { userRepository } from "../repositories/user.js"

export const findAllUsers = async (perPage: number, currentPage: number) => {
  return userRepository.findAll(perPage, currentPage)
}

export const findUserById = async (id: string) => {
  return userRepository.findById(id)
}

export const findUserByEmail = async (email: string) => {
  return userRepository.findByEmail(email)
}

export const findUserByUsername = async (username: string) => {
  return userRepository.findByUsername(username)
}

export const findUserByGoogleId = async (googleId: string) => {
  return await userRepository.findByGoogleId(googleId)
}

export const linkUserGoogleAccount = async (userId: string, googleId: string) => {
  return await userRepository.linkGoogleAccount(userId, googleId)
}

export const createUser = async (data: UserInsert) => {
  return userRepository.create(data)
}

export const getUserStudiesCount = async (id: string) => {
  return await userRepository.getStudiesCount(id)
}

export const getUserTasksCount = async (id: string) => {
  return await userRepository.getTasksCount(id)
}

export const getUserStudiesPercentage = async (id: string) => {
  const studies = await userRepository.findStudies(id)

  if (studies.length === 0) return 0
  const totalProgress = studies.reduce((acc, study) => acc + study.progress, 0)
  const percentage = totalProgress / studies.length

  return percentage
}

export const findUserStudies = async (id: string) => {
  return await userRepository.findStudies(id)
}

export const updateUserById = async (id: string, data: UpdateUserType) => {
  return await userRepository.updateById(id, data)

}

export const deleteUserById = async (id: string) => {
  return await userRepository.deleteById(id)
}

export const updateImageByUser = async (id: string, imageUrl: string) => {
  return await userRepository.updateImage(id, imageUrl)
}