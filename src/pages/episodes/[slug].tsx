import { parseISO } from 'date-fns';
import format from 'date-fns/format/index.js';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import { getSyntheticLeadingComments } from 'typescript';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';

import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description:string;
};

type EpisodesProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodesProps) {
    const router = useRouter();

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <button type="button">
                    <img src="/arrow-left.svg" alt="Voltar"/>
                </button>
                <Image 
                width={700} 
                height={160} 
                src={episode.thumbnail}
                objectFit="cover" />
                <button type="button">
                    <img src="/play.svg" alt="Toca episodio"/>
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <h1>{episode.members}</h1>
                <h1>{episode.publishedAt}</h1>
                <h1>{episode.durationAsString}</h1>
            </header>
            <div className={styles.description} 
            dangerouslySetInnerHTML={{ __html: episode.description }} 
            /> 
            </div>  
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get('/episodes/${slug}')

    const episode = {

        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    };

    return {
        props: {
            episode,


        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}