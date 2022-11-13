import { ChatRoom } from '@entities/chat-room.entity';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { ChatRoomResponseDTO } from './dto/chat-room.dto';

@Injectable()
export class ChatRoomService extends GenericService(ChatRoom) {
  async createChatRoom(
    userOne: string,
    userTwo: string,
  ): Promise<ChatRoomResponseDTO> {
    try {
      if (!userOne || !userTwo) {
        throw new BadRequestException(
          'Fields userOne and userTwo are required',
        );
      }
      const recordExists = await this.getRepo().findOne({
        where: [
          { userOne, userTwo },
          { userOne: userTwo, userTwo: userOne },
        ],
      });
      if (recordExists?.id) {
        return {
          success: true,
          code: HttpStatus.CREATED,
          data: recordExists,
          message: 'Created',
        };
      }
      const createdRecord = await this.create<Partial<ChatRoom>>({
        userOne,
        userTwo,
      });
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdRecord,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
