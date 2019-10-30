import React, { useState } from 'react'
import Img from 'react-image'
import { PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './Twitter.module.css'

export const TimelineItem = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelineTweet}>
            <a href={item.url} className={styles.avatar}>
                <Img src={item.user.picture} alt="Avatar" />
            </a>
            <span className={styles.username}>
                {item.text.substring(0, 2) === 'RT' ? <span>RT </span> : null}
                <a href={item.url}>@{item.user.username}</a>
            </span>
            <p dangerouslySetInnerHTML={{ __html: item.originalText ? item.originalText : item.text }}></p>
            {item.pictures && (
                <ul className={styles.pictures}>
                    {item.pictures.map(picture => (
                        <li key={picture.id} onClick={handleClick}>
                            <span style={{ backgroundImage: `url(${picture.url})` }} className={styles.picture} />
                            {item.video && <PlayLogo className={styles.video} />}
                        </li>
                    ))}
                </ul>
            )}
            {showDetails && <Modal item={item} onClose={handleClick} />}
        </div>
    )
}
