import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Story } from '../interface/event';

// Step ->
//          Choix d'emojis proposé
//          Vote en temps réel
//          Après un temps imparti, l'emoji qui a le plus de votes est enregistré
//          -> Cycle

@WebSocketGateway({
  cors: true,
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Socket;

  clientList: Map<Socket, Record<number, string>> = new Map();

  story: Story = {
    storyGPT: '',
    steps: [
      {
        selectedEmoji: '',
        order: 1,
        emojiCandidate: { '😞': 0, '🤜🏽': 0, '🧌': 0, ඞ: 0 },
      },
    ],
  };

  handleConnection(client: Socket, ...args: any[]) {
    this.clientList.set(client, {});

    client.emit('story-update', this.story);
  }

  handleDisconnect(client: any, ...args: any[]) {
    this.clientList.delete(client);
  }

  /**
   * Gerer le vote
   * Créer une fonction avec un subscriber
   * - Augmenter le nombre de vote de l'emoji selectionné sur le current step ✅
   * - Synchroniser tous les clients ✅
   * - Gérer les erreurs ✅
   *
   * step-vote
   */

  @SubscribeMessage('step-vote')
  stepVote(
    client: Socket,
    payload: {
      emoji: string;
      stepOrder: number;
    },
  ) {
    try {
      const currentStep = this.story.steps.find(
        (step) => step.order === payload.stepOrder,
      );
      if (!currentStep) throw new Error('Step not found');
      // const currentStepIndex = this.story.steps.length;
      // No step
      // emoji not found
      if (this.story.steps.length === 0)
        throw new Error("The vote hasn't started");
      if (!Object.keys(currentStep.emojiCandidate).includes(payload.emoji))
        throw new Error("You voted for an emoji that isn't a candidate?!");

      // const clientVote = this.clientList.get(client);

      // if (clientVote[currentStepIndex] === payload.emoji)
      //   throw new Error(`You already voted for : ${payload.emoji}`);

      // clientVote[currentStepIndex] = payload.emoji;

      currentStep.emojiCandidate[payload.emoji]++;

      this.server.emit('story-update', this.story);
    } catch (err) {
      this.server.emit('story-error', err.message);
    }
  }
}
