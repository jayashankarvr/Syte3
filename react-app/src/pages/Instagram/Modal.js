import React from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Modal from 'components/Modal'
import styles from 'components/Modal/Modal.module.css'

const InstagramModal = ({ item, onClose }) => {
    return (
        <Modal onClose={onClose}>
            {item.video ? (
                <video src={item.video.url} className={styles.media} poster={item.pictureHD} controls />
            ) : (
                <Img
                    src={item.pictureHD ? item.pictureHD : item.picture}
                    alt="Instagram Post"
                    className={styles.media}
                />
            )}
            <div className={`${styles.details} ${styles.stacked}`}>
                <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
                <span className={styles.date}>
                    {formatDistanceToNow(typeof item.date === 'string' ? parseISO(item.date) : item.date)} ago
                </span>
            </div>
        </Modal>
    )
}

export default InstagramModal
