import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const Room = (props) => {
  const userVideo = useRef(document.createElement('video'));
  const otherUser = useRef(document.createElement('video'));
  const videosGrid = useRef(document.getElementById('videos'));
  const socketRef = useRef();

  const myPeer = new Peer(undefined, {
    host: 'localhost',
    port: '8000',
    path: '/peerjs',
  });

  useEffect(() => {
    userVideo.current.muted = true;
    socketRef.current = io.connect('/');

    myPeer.on('open', (id) => {
      socketRef.current.emit('joinRoom', props.match.params.roomID, id);
      console.log('joined room');
    });

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        // current user
        userVideo.current.srcObject = stream;
        userVideo.current.addEventListener('loadedmetadata', () => {
          userVideo.current.play();
        });
        videosGrid.current.append(userVideo.current);
        console.log('me connected');

        // answer call
        myPeer.on('call', (call) => {
          console.log('enter call');
          call.answer(stream);
          call.on('stream', (userVideoStream) => {
            otherUser.current.srcObject = userVideoStream;
            otherUser.current.addEventListener('loadedmetadata', () => {
              otherUser.current.play();
            });
            videosGrid.current.append(otherUser.current);
            console.log('done call');
          });
        });

        // other user
        socketRef.current.on('user-connected', (userID) => {
          console.log('new user', userID);
          const call = myPeer.call(userID, stream);
          console.log('new useer call', call);
          call.on('stream', (userVideoStream) => {
            console.log('new user enter stream', userVideoStream);
            otherUser.current.srcObject = userVideoStream;
            otherUser.current.addEventListener('loadedmetadata', () => {
              otherUser.current.play();
            });
            videosGrid.current.append(otherUser.current);
            console.log('user connected');
          });
        });
      });
  });

  return (
    <div>
      <div id="videos" ref={videosGrid}></div>
    </div>
  );
};

export default Room;
