import Drive from '@ioc:Adonis/Core/Drive'
import { IUploadController } from 'App/Interfaces/UploadInterface'
import { TContext } from 'App/Types/Context'

export default class UploadController implements IUploadController {
  public async upload({ request, response }: TContext) {
    const images = request.files('images', {
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf'],
    })

    const urls: string[] = []

    for (let image of images) {
      const path = `${new Date().getTime()}-${image.clientName}`
      await image.moveToDisk(
        './',
        {
          name: path,
          contentType: image.type,
        },
        's3'
      )

      const url = await Drive.getUrl(path)
      urls.push(url)
    }

    response.ok({ payload: urls })
  }
}
