import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  MessageProps,
} from 'react-native-gifted-chat';

import ChatMessageBox from './components/ChatMessageBox';
import ReplyMessageBar from './components/ReplyMessageBar';

const AppChat = () => {
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const clearReplyMessage = () => setReplyMessage(null);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const renderCustomInputToolbar = (props: InputToolbarProps) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputContainer}
      accessoryStyle={styles.replyBarContainer}
    />
  );

  const renderAccessory = () =>
    replyMessage && (
      <ReplyMessageBar message={replyMessage} clearReply={clearReplyMessage} />
    );

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  const renderMessageBox = (props: MessageProps<IMessage>) => (
    <ChatMessageBox
      {...props}
      setReplyOnSwipeOpen={setReplyMessage}
      updateRowRef={updateRowRef}
    />
  );

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      wrapInSafeArea={false}
      isKeyboardInternallyHandled={false}
      renderInputToolbar={renderCustomInputToolbar}
      renderAccessory={renderAccessory}
      onLongPress={(_, message) => setReplyMessage(message)}
      messagesContainerStyle={styles.messagesContainer}
      renderMessage={renderMessageBox}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    flexDirection: 'column-reverse',
  },
  replyBarContainer: {
    height: 'auto',
  },
  messagesContainer: {
    flex: 1,
  },
});

export default AppChat;
