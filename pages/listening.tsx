import useFetcher from "../hooks/DataFetching";

import styles from "../styles/pages/Listening.module.scss";

import Image from "../components/Image";
import { useEffect, useState } from "react";

const Listening = () => {
    const { data: currentlyPlaying, mutate: mutateCurrentlyPlaying } =
        useFetcher("/api/spotify/playing");
    const { data: recentlyPlayed, mutate: mutatedPlayed } = useFetcher(
        "/api/spotify/recentlyPlayed",
        null,
        0
    );

    let playing: null | {
        albumArt: string;
        name: string;
        isPaused: Boolean;
        albumName: string;
        artist: string;
        progress: number;
    } = null;

    if (!currentlyPlaying) {
        if (recentlyPlayed) {
            const recent = recentlyPlayed.items?.[0];
            playing = {
                albumArt: recent?.track?.album?.images?.[1]?.url,
                albumName: recent?.track?.album?.name,
                artist: recent?.track?.artists?.[0]?.name,
                name: recent?.track?.name,
                isPaused: true,
                progress: -1,
            };
        }
    } else {
        playing = {
            albumArt: currentlyPlaying?.item?.album?.images?.[1]?.url,
            albumName: currentlyPlaying?.item?.album?.name,
            artist: currentlyPlaying?.item?.artists?.[0]?.name,
            name: currentlyPlaying?.item?.name,
            isPaused: !currentlyPlaying?.is_playing,
            progress: currentlyPlaying.progress_ms,
        };
    }

    // console.log(recentlyPlayed);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (currentlyPlaying?.progress_ms == null) {
            return;
        }

        setProgress(currentlyPlaying.progress_ms);
    }, [currentlyPlaying]);

    useEffect(() => {
        const intervalSpeed = 100;
        const interval = setInterval(() => {
            let tempProg = 0;
            setProgress((p) => {
                tempProg = p + 100;
                return tempProg;
            });
        }, intervalSpeed);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (progress == null || currentlyPlaying?.item?.duration_ms == null)
            return;

        if (playing?.progress == -1) return;

        if (progress >= currentlyPlaying?.item?.duration_ms) {
            setProgress(0);
            mutateCurrentlyPlaying();
            mutatedPlayed();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress]);

    return (
        <div className={styles.container}>
            <h1>What I{"'"}m listening to at the moment</h1>
            {playing && (
                <div className={styles.nowPlaying}>
                    <div className={styles.blurBG}></div>
                    {playing.albumArt ? (
                        <div className={styles.imageBG}>
                            <Image
                                src={playing.albumArt}
                                layout="fill"
                                alt={""}
                                unoptimized={true}
                            />
                        </div>
                    ) : (
                        false
                    )}
                    <div className={styles.image}>
                        {playing.albumArt ? (
                            <Image
                                src={playing.albumArt}
                                width={150}
                                height={150}
                                alt={""}
                                unoptimized={true}
                            />
                        ) : (
                            false
                        )}
                    </div>
                    <div className={styles.details}>
                        {!playing?.isPaused ? (
                            <div className={styles.label}>Now playing</div>
                        ) : (
                            <div className={styles.label}>Paused</div>
                        )}
                        <div className={styles.songInfo}>
                            <span className={styles.song}>{playing.name}</span>
                            <div>
                                <span className={styles.artist}>
                                    {playing.artist}
                                </span>
                                {" - "}
                                <span className={styles.album}>
                                    {playing.albumName}
                                </span>
                            </div>
                        </div>
                        {!playing?.isPaused && (
                            <div className={styles.bar}>
                                <div
                                    className={styles.progress}
                                    style={{
                                        width: `${
                                            (progress /
                                                currentlyPlaying?.item
                                                    ?.duration_ms) *
                                            100
                                        }%`,
                                    }}></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={styles.recentlyPlayed}>
                <p>Recently Played</p>
                <div className={styles.items}>
                    {recentlyPlayed?.items.map((item: any, index: number) => (
                        <a
                            key={index}
                            href={item?.track?.external_urls?.spotify}
                            className={styles.track}>
                            {item?.track?.album?.images?.[1]?.url && (
                                <div className={styles.trackImage}>
                                    <Image
                                        src={
                                            item?.track?.album?.images?.[1]?.url
                                        }
                                        alt={""}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            )}
                            <div className={styles.details}>
                                <span>{item?.track?.name}</span>
                                <div className={styles.trackBottomLine}>
                                    <span>
                                        {item?.track?.artists?.[0]?.name}
                                    </span>
                                    {" - "}
                                    <span>{item?.track?.album?.name}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Listening;
