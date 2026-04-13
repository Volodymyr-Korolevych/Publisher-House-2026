import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const useStorageUpload = () => {
  const { $storage } = useNuxtApp()

  const uploadFile = async (file: File, folder: string) => {
    const fileRef = ref($storage, `${folder}/${Date.now()}-${file.name}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    return url
  }

  return {
    uploadCover: (file: File) => uploadFile(file, 'covers'),
    uploadBook: (file: File) => uploadFile(file, 'books')
  }
}
