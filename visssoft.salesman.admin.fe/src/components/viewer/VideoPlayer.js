import React from "react";

const VideoPlayer = ({ src }) => {
    const videoRef = useRef(null);

    const canPlayType = (type) => {
        if (!videoRef.current) {
            return '';
        }
        return videoRef.current.canPlayType(type);
    };

    const canPlayMp4 = canPlayType('video/mp4');
    const canPlayWebm = canPlayType('video/webm');
    const canPlayOgg = canPlayType('video/ogg');

    const isMp4Compatible = canPlayMp4 === 'probably' || canPlayMp4 === 'maybe';
    const isWebmCompatible = canPlayWebm === 'probably' || canPlayWebm === 'maybe';
    const isOggCompatible = canPlayOgg === 'probably' || canPlayOgg === 'maybe';

    const getVideoSource = () => {
        if (isMp4Compatible) {
            return <source src={videoUrl} type="video/mp4" />;
        }
        if (isWebmCompatible) {
            return <source src={videoUrl} type="video/webm" />;
        }
        if (isOggCompatible) {
            return <source src={videoUrl} type="video/ogg" />;
        }
        return <p>Your browser doesn't support the video format.</p>;
    };

    return (
        <div>
            <video ref={videoRef} controls>
                {getVideoSource()}
            </video>
        </div>
    );
};

export default VideoPlayer;