import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  BubbleProps,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  MessageProps,
} from 'react-native-gifted-chat';

import ChatMessageBox from './components/ChatMessageBox';
import ReplyMessageBar from './components/ReplyMessageBar';

type MyMessage = IMessage & {
  replyMessage?: {
    text: string;
  };
};

const AppChat = () => {
  const [replyMessage, setReplyMessage] = useState<MyMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);

  const [messages, setMessages] = useState<MyMessage[]>([]);

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

  const onSend = useCallback(
    (messages = []) => {
      if (replyMessage) {
        messages[0].replyMessage = {
          text: replyMessage.text,
        };
      }
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      setReplyMessage(null);
    },
    [replyMessage]
  );

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

  const renderMessageBox = (props: MessageProps<MyMessage>) => (
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

  const renderReplyMessageView = (props: BubbleProps<MyMessage>) =>
    props.currentMessage &&
    props.currentMessage.replyMessage && (
      <View style={styles.replyMessageContainer}>
        <Text>{props.currentMessage.replyMessage.text}</Text>
        <View style={styles.replyMessageDivider} />
      </View>
    );

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
      renderCustomView={renderReplyMessageView}
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
  replyMessageContainer: {
    padding: 8,
    paddingBottom: 0,
  },
  replyMessageDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingTop: 6,
  },
});

export default AppChat;
