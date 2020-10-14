import React, { useEffect, useRef } from 'react';
import kurentoClient from 'kurento-client'
import kurentoUtils from 'kurento-utils'
import './App.css';

const configurations = {
  ws_uri: "wss://kms.awakeco.gobeplus.com/",
  ice_servers: [
    {
      'urls': 'stun:stun.1.awakeco.gobeplus.com:3478'
    },
    {
      'urls': 'turn:turn.1.awakeco.gobeplus.com:3478',
      'credential': 'kobe@007',
      'username': 'awakeco'
    }
  ]
}

function App() {
  const deletePinButton = useRef()
  const localVideoRef = useRef()
  const remoteVideoRef = useRef()
  useEffect(()=>{
    console.clear()
  },[])

  // const win = window.remote.getCurrentWindow()
  // useEffect(()=>{
  //   window.ipc.on('ping', (event, message) => {
  //     console.log(message)
  //   })
  // }, [])

  // function screenHandle(e) {
  //     e.preventDefault()
  //     win.setFullScreen(!win.isFullScreen())
  // }

  function setIceCandidateCallbacks(webRtcPeer, webRtcEp, onerror)
  {
    webRtcPeer.on('icecandidate', function(candidate) {
      console.log("Local candidate:",candidate);

      candidate = kurentoClient.getComplexType('IceCandidate')(candidate);

      webRtcEp.addIceCandidate(candidate, onerror)
    });

    webRtcEp.on('IceCandidateFound', function(event) {
      var candidate = event.candidate;

      console.log("Remote candidate:",candidate);

      webRtcPeer.addIceCandidate(candidate, onerror);
    });
  }

  function getFileName(){
    function formatDate(timestr=null) {
      const date = timestr?(new Date(timestr)):(new Date())
      const dd = parseInt(date.getDate()) > 9 ? parseInt(date.getDate()) : '0' + parseInt(date.getDate())
      const mm = (parseInt(date.getMonth()) + 1) > 9 ? (parseInt(date.getMonth()) + 1) : '0' + (parseInt(date.getMonth()) + 1)
      const yyyy = ('' + date.getFullYear())
      const hh = parseInt(date.getHours()) > 9 ? parseInt(date.getHours()) : '0' + parseInt(date.getHours())
      const min = parseInt(date.getMinutes()) > 9 ? parseInt(date.getMinutes()) : '0' + parseInt(date.getMinutes())
      const sec = parseInt(date.getSeconds()) > 9 ? parseInt(date.getSeconds()) : '0' + parseInt(date.getSeconds())
      return yyyy + '' + mm + '' + dd + '_' + hh + '' + min +  '' + sec
    }
    return 'file:///tmp/records/'+formatDate()+'.webm'
  }

  function postPinHandler(e){
    e.preventDefault()
    console.log('Control: POST PIN')
    //remoteVideo: remoteVideoRef.current,
    const options = {
      remoteVideo: remoteVideoRef.current,
      localVideo: localVideoRef.current,
      configuration: {
        iceServers: configurations.ice_servers
      }
    }

    let webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error){
      if(error) return console.log(error)
      this.generateOffer(onOffer)
    });

    function onOffer(error, offer) {
      if (error) return console.log(error);
  
      console.log("Offer...");
  
      kurentoClient(configurations.ws_uri, function(error, client) {
        if (error) return console.log(error);
  
        client.create('MediaPipeline', function(error, pipeline) {
          if (error) return console.log(error);
  
          console.log("Got MediaPipeline");
  
          var elements =
          [
            {type: 'RecorderEndpoint', params: {uri : getFileName()}},
            {type: 'WebRtcEndpoint', params: {}}
          ]
  
          pipeline.create(elements, function(error, elements){
            if (error) return console.log(error);
  
            var recorder = elements[0]
            var webRtc   = elements[1]
  
            setIceCandidateCallbacks(webRtcPeer, webRtc, err=>{if(err)console.log(error)})
  
            webRtc.processOffer(offer, function(error, answer) {
              if (error) return console.log(error);
  
              console.log("offer");
  
              webRtc.gatherCandidates(err=>{if(err)console.log(error)});
              webRtcPeer.processAnswer(answer);
            });
  
            client.connect(webRtc, webRtc, function(error) {
              if (error) {
                return console.log(error);
              }
  
              client.connect(webRtc, recorder, function(error) {
                console.log("Connected");
  
                recorder.record(function(error) {
                  if (error) return console.log(error);
  
                  console.log("record");
  
                  deletePinButton.current.addEventListener("click", e => {
                    recorder.stop();
                    pipeline.release();
                    webRtcPeer.dispose();
                    localVideoRef.current.src = "";
                    localVideoRef.current.src = "";
                  })
                });
              });
            });
          });
        });
      });
    }
  }

  function deletePinHandler(e){
    e.preventDefault()
    console.log('Control: DELETE PIN')
  }

  function callHandler(e){
    e.preventDefault()
    console.log('Control: Call')
  }

  function hangupHandler(e){
    e.preventDefault()
    console.log('Control: Hangup')
  }

  return (
    <div className="App">
      <h4>Local Video</h4>
      <video ref={localVideoRef} autoPlay={true}></video>
      <h4>Remote Video</h4>
      <video ref={remoteVideoRef} autoPlay={true}></video>
      <h4>Controller</h4>
      <button onClick={postPinHandler} style={{marginRight:'20px'}}>POST PIN</button>
      <button ref={deletePinButton} onClick={deletePinHandler} style={{marginRight:'20px'}}>DELETE PIN / TIMEOUT</button>
      <button onClick={callHandler} style={{marginRight:'20px'}}>Call</button>
      <button onClick={hangupHandler}>Hangup</button>
    </div>
  );
}

export default App;
