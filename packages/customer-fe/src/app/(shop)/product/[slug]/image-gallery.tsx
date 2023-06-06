'use client'

import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import Image from 'next/image';

export default function Gallery({
    images
}: {
    images: {
        original: string,
        thumbnail: string
    }[]
}) {
    return (
        <div>
            <ImageGallery
                items={images}
                thumbnailPosition='left'
                showPlayButton={false}
                renderItem={({ original }) => (
                    <div
                        className='aspect-[4/3]'
                    >
                        <Image
                            src={original}
                            fill
                            alt="Product image"
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                )}
            />
        </div>
    );
}