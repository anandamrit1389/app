import { SlideTransition } from '@/interfaces/IPresentation';
import { ITemplate } from '@/interfaces/ISlides';

import OriginLight from '@/assets/templates/origin-light.png';
import OriginDark from '@/assets/templates/origin-dark.png';
import FutureVision from '@/assets/templates/future-vision-thumb.png';
import FunAndGames from '@/assets/templates/fun-and-games-thumb.png';
import PitchDeck from '@/assets/templates/pitch-deck-thumb.png';
import BoardReport from '@/assets/templates/board-report-thumb.png';
import CreativeSpark from '@/assets/templates/creative-spark-thumb.png';
import CorporateVision from '@/assets/templates/corporate-vision-thumb.png';
import MonthlyReport from '@/assets/templates/monthly-report-thumb.png';
import FastTurn from '@/assets/templates/fast-turn-thumb.png';
import { ImageStyleSlug } from '@/interfaces/images-styles.interface';

import boardReportCover from '@/assets/templates/board-report-cover.png';
import boardReportSection from '@/assets/templates/board-report-section.png';
import futureVisionImage from '@/assets/templates/future-vision.png';
import corporateVisionCoverImage from '@/assets/templates/corporate-vision-cover.png';
import corporateVisionSectionImage from '@/assets/templates/corporate-vision-section.png';
import monthlyReportCover from '@/assets/templates/monthly-report-cover.png';
import monthlyReportSection from '@/assets/templates/monthly-report-section.png';
import fastTurnCover from '@/assets/templates/fast-turn-cover.png';
import fastTurnSection from '@/assets/templates/fast-turn-section.png';
import funAndGamesImage from '@/assets/templates/fun-and-games.png';
import creativeSparkCover from '@/assets/templates/creative-spark-cover.png';
import creativeSparkSection from '@/assets/templates/creative-spark-section.png';
import creativeSparkAgenda from '@/assets/templates/creative-spark-agenda.png';
import pitchDeckImage from '@/assets/templates/pitch-deck.png';
export const getTemplates = () => {
  return [
    lightTemplate,
    darkTemplate,
    boardReport,
    futureVision,
    corporateVision,
    monthlyReport,
    fastTurn,
    creativeSpark,
    funAndGames,
    pitchDeck,
  ];
};

export interface ITemplatePreview {
  src: string;
  name: string;
  key: string;
  length: number;
}

export const getTemplate = (key: string) => {
  switch (key) {
    case 'light':
      return lightTemplate;
    case 'dark':
      return darkTemplate;
    case 'boardReport':
      return boardReport;
    case 'futureVision':
      return futureVision;
    case 'corporateVision':
      return corporateVision;
    case 'monthlyReport':
      return monthlyReport;
    case 'fastTurn':
      return fastTurn;
    case 'creativeSpark':
      return creativeSpark;
    case 'funAndGames':
      return funAndGames;
    case 'pitchDeck':
      return pitchDeck;
  }
};

export const getThumbByThemeId = (id: string) => {
  switch (id) {
    case 'light':
      return OriginLight;
    case 'dark':
      return OriginDark;
    case 'boardReport':
      return BoardReport;
    case 'futureVision':
      return FutureVision;
    case 'corporateVision':
      return CorporateVision;
    case 'monthlyReport':
      return MonthlyReport;
    case 'fastTurn':
      return FastTurn;
    case 'creativeSpark':
      return CreativeSpark;
    case 'funAndGames':
      return FunAndGames;
    case 'pitchDeck':
      return PitchDeck;
  }
};

export const getTemplatesPreview = (ignoredKeys: string[] = []): ITemplatePreview[] => {
  return [
    { src: OriginLight, name: 'Origin light', key: 'light', length: 10 },
    { src: OriginDark, name: 'Origin dark', key: 'dark', length: 10 },
    { src: BoardReport, name: 'Board report', key: 'boardReport', length: 10 },
    {
      src: CreativeSpark,
      name: 'Creative spark',
      key: 'creativeSpark',
      length: 10,
    },
    { src: FunAndGames, name: 'Fun & Games', key: 'funAndGames', length: 10 },
    { src: PitchDeck, name: 'Pitch deck', key: 'pitchDeck', length: 10 },
    {
      src: FutureVision,
      name: 'Future vision',
      key: 'futureVision',
      length: 10,
    },
    {
      src: CorporateVision,
      name: 'Corporate vision',
      key: 'corporateVision',
      length: 10,
    },
    {
      src: MonthlyReport,
      name: 'Monthly report',
      key: 'monthlyReport',
      length: 10,
    },
    { src: FastTurn, name: 'Fast Turn', key: 'fastTurn', length: 10 },
  ].filter((template) => !ignoredKeys.includes(template.key));
};

export const lightTemplate: ITemplate = {
  id: 'presentation1',
  template: 'light',
  templateKey: 'light',
  readonly: false,
  themeId: 'light',
  authorName: 'test',
  fontFamily: 'inter',
  description: 'A journey to Mars - exploring the Red Planet',
  textAmount: 'keynote',
  numberOfSlides: 5,
  imageStyle: ImageStyleSlug.Minimalistic,
  extraFonts: [],
  extraThemes: [],
  language: 'english',
  translatedLanguages: [],
  title: 'Origin light',
  titleTranslations: {},
  slides: [
    {
      id: 'slide1',
      slideNumber: 1,
      slideType: 'title-slide',
      title: 'Deck title will go just right here looking lit',
      titleTranslations: {},
      subtitleTranslations: {},
      withoutHeader: true,
      accentImage:
        'https://plus.unsplash.com/premium_photo-1697730134257-0548479d7cf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      variation: 'center',
      content: [],
    },
    {
      id: 'slideX',
      slideNumber: 2,
      slideType: 'content-slide',
      title: 'Contents',
      titleTranslations: {},
      subtitleTranslations: {},
      variation: 'default',
      content: [
        {
          id: 'content2sdfgrhgsfdjgfhd',
          contentType: 'text',
          text: 'Lorem ipsum dolor sit amet consectetur',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 1,
        },
        {
          id: 'content34dbawetnaw',
          contentType: 'text',
          text: 'Lorem ipsum dolor sit amet consectetur',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 2,
        },
        {
          id: 'content234sdagdgas',
          contentType: 'text',
          text: 'Lorem ipsum dolor sit amet consectetur',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 3,
        },
        {
          id: 'content2sdfg',
          contentType: 'text',
          text: 'Lorem ipsum dolor sit amet consectetur',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 4,
        },
        {
          id: 'content34sdgsdgasd',
          contentType: 'text',
          text: 'Lorem ipsum dolor sit amet consectetur',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 5,
        },
        {
          id: 'content234',
          contentType: 'text',
          text: 'Lorem ipsum dolor sit amet consectetur',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 6,
        },
      ],
    },
    {
      id: 'slide1asdf',
      slideNumber: 3,
      slideType: 'section-headline-slide',
      title: 'Section headline',
      titleTranslations: {},
      subtitleTranslations: {},
      accentImage:
        'https://images.unsplash.com/photo-1712843886611-9f42333534e5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      variation: 'center',
      content: [],
    },
    {
      id: 'slide2',
      slideNumber: 4,
      slideType: 'image-caption-slide',
      title: 'This is a headline',
      titleTranslations: {},
      subtitleTranslations: {},
      variation: '3/2',
      accentImage:
        'https://inabit-prod-presentation-images.s3.us-east-1.amazonaws.com/WhatsApp+Image+2025-04-22+at+12.31.06.jpeg',
      content: [
        {
          id: 'content2hjgh',
          contentType: 'card',
          title: 'Subheadline',
          subtitle: 'Curiosity',
          text: 'Caption is a short text that gives context to an amazing image and video.',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1713002367956-1531f7bf7287?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 1,
        },
        {
          id: 'content3dxg',
          contentType: 'card',
          title: 'Subheadline',
          subtitle: 'Ingenuity',
          text: 'Caption is a short text that gives context to an amazing image and video.',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1721332149274-586f2604884d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 2,
        },
        {
          id: 'content4szfdh',
          contentType: 'card',
          title: 'Subheadline',
          subtitle: 'Ingenuity',
          text: 'Caption is a short text that gives context to an amazing image and video.',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 3,
        },
      ],
    },
    {
      id: 'slide31q2345',
      slideNumber: 5,
      slideType: 'bullet-points-slide',
      variation: 'left-1/2-list',
      title: 'Challenges of Mars Exploration',
      subtitle:
        'Exploring Mars presents numerous challenges that scientists and engineers must overcome to ensure the success of the mission.',
      titleTranslations: {},
      subtitleTranslations: {},
      accentImage:
        'https://images.unsplash.com/photo-1629362012913-4ae2ebf14a9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hcnN8ZW58MHx8MHx8fDA%3D',
      content: [
        {
          id: 'content5`12123',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Exploring Mars presents numerous challenges that scientists and engineers must overcome to ensure the success of the mission. Exploring Mars presents numerous challenges that scientists and engineers must overcome to ensure the success of the mission.',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 1,
        },
        {
          id: 'content612345',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Radiation exposure',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 2,
        },
        {
          id: 'content7456',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Communication delays',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 3,
        },
        {
          id: 'content8456',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Limited resources',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 4,
        },
      ],
    },
    {
      id: 'slide4dffg',
      slideNumber: 6,
      slideType: 'image-text-slide',
      title: 'Life on Mars',
      titleTranslations: {},
      subtitleTranslations: {},
      variation: 'left',
      accentImage:
        'https://images.unsplash.com/photo-1511721511189-ca0a98b3229e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        {
          id: 'content9retfj',
          sortOrder: 1,
          contentType: 'side-bar',
          title:
            "Body copy refers to the main textcontent used in design and marketing, intended to communicate information clearly and effectively. It's often placed below headlines or subheadings and guides the reader through details.",
          text: '',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        },
      ],
    },
    {
      id: 'slide7agrst',
      slideNumber: 7,
      slideType: 'important-text-slide',
      variation: 'central',
      title: 'Future Missions',
      titleTranslations: {},
      subtitleTranslations: {},
      content: [
        {
          id: 'content1331',
          sortOrder: 1,
          contentType: 'text',
          title: 'Human Exploration',
          text: 'NASA and other space agencies are planning to send humans to Mars in the near future.',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        },
      ],
    },
    {
      id: 'slide8fghjk',
      slideNumber: 8,
      slideType: 'text-slide',
      variation: 'two-col-text',
      title: 'Ultrices pellentesque',
      subtitle: 'Ultrices pellentesque nibh vulputate nibh vulputate',
      titleTranslations: {},
      subtitleTranslations: {},
      content: [
        {
          id: 'ssadfASD',
          sortOrder: 1,
          contentType: 'text',
          title: 'Lorem ipsum dolor sit adorem ipsum dolor sit amet consect. ',
          text: 'Lorem ipsum dolor sit amet consectetur. Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Lorem ipsum dolor sit amet consectetur. Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod. Lorem ipsum dolor sit amet consectetur. Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Lorem ipsum dolor sit amet consectetur. ',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        },
        {
          id: 'ssadfASDasdf',
          sortOrder: 2,
          contentType: 'text',
          title: 'Lorem ipsum dolor sit adorem ipsum dolor sit amet consect. ',
          text: 'Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod. Lorem ipsum dolor sit amet consectetur. Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Lorem ipsum dolor ',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        },
        {
          id: 'ssadfASDtykjfhg',
          sortOrder: 3,
          contentType: 'text',
          title: 'Lorem ipsum dolor sit adorem ipsum dolor sit amet consect. ',
          text: 'Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod. Lorem ipsum dolor sit amet consectetur. Ultrices pellentesque nibh vulputate commodo leo. Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Lorem ipsum dolor ',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        },
      ],
    },
    {
      id: 'slide3asdfascsvb',
      slideNumber: 9,
      slideType: 'shapes-slide',
      variation: 'two-rows',
      title: 'Challenges of Mars Exploration',
      subtitle:
        'Exploring Mars presents numerous challenges that scientists and engineers must overcome to ensure the success of the mission.',
      titleTranslations: {},
      subtitleTranslations: {},
      accentImage:
        'https://photos5.appleinsider.com/gallery/39156-74877-Earth_At_Night_Photo_010401-xl.jpg',
      content: [
        {
          id: 'content5lj',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Exploring Mars presents',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 1,
        },
        {
          id: 'content6dgrx',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Radiation exposure',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 2,
        },
        {
          id: 'content7rtd',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Communication delays',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 3,
        },
        {
          id: 'content834',
          contentType: 'list-item',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          text: 'Limited resources',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          sortOrder: 4,
        },
      ],
    },
    {
      id: 'slide2g,jn',
      slideNumber: 10,
      slideType: 'images-slide',
      title: 'Key Missions',
      titleTranslations: {},
      subtitleTranslations: {},
      variation: 'default',
      accentImage: '',
      content: [
        {
          id: 'content2sgrzb',
          contentType: 'image',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1713002367956-1531f7bf7287?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 1,
        },
        {
          id: 'content3zsrjncyt,',
          contentType: 'image',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1728743264694-4ac39fa29385?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 2,
        },
        {
          id: 'content4dxbhrse4',
          contentType: 'image',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 3,
        },
        {
          id: 'contentrzhnerb43',
          contentType: 'image',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://photos5.appleinsider.com/gallery/39156-74877-Earth_At_Night_Photo_010401-xl.jpg',
          sortOrder: 2,
        },
        {
          id: 'contentbawvct4xg4',
          contentType: 'image',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1729731322197-0d9282935266?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 3,
        },
        {
          id: 'contennwbtrsetvhct2',
          contentType: 'image',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1728873272952-b48fd3e64c4d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          sortOrder: 1,
        },
      ],
    },
    {
      id: 'slide4dffghdfhndf',
      slideNumber: 11,
      slideType: 'closing-slide',
      title: 'Thank you',
      titleTranslations: {},
      subtitleTranslations: {},
      variation: 'left',
      accentImage:
        'https://images.unsplash.com/photo-1511721511189-ca0a98b3229e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        {
          id: 'content9retfj12',
          sortOrder: 1,
          contentType: 'side-bar',
          title: 'cool.email@mail.com',
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
          image:
            'https://images.unsplash.com/photo-1728881652464-bcd24af9a521?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
          text: 'Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Nec sed sit nascetur molestie feugiat fermentum aliquam purus lorem. Risus id ullamcorper ac sed tempor eget. Ultrices interdum pulvinar curabitur euismod faucibus aliquam lacus eget imperdiet. Nec sed sit nascetur molestie feugiat fermentum aliquam purus lorem. Risus id ullamcorper ac sed tempor eget. Ultrices interdum pulvinar curabitur euismod faucibus.',
        },
      ],
    },
  ],
  slideTransition: SlideTransition.NONE,
};

export const darkTemplate: ITemplate = {
  ...lightTemplate,
  themeId: 'grey',
  title: 'Origin Dark',
  templateKey: 'dark',
  id: 'pres2',
};

export const boardReport: ITemplate = {
  ...lightTemplate,
  fontFamily: 'cairo',
  themeId: 'boardReport',
  title: 'Board report',
  templateKey: 'boardReport',
  id: 'pres4',
  coverBg: `url(${boardReportCover})`,
  agendaBg: `url(${boardReportSection})`,
  sectionBg: `url(${boardReportSection})`,
};

export const futureVision: ITemplate = {
  ...lightTemplate,
  fontFamily: 'poppins',
  themeId: 'futureVision',
  title: 'Future vision',
  templateKey: 'futureVision',
  id: 'pres5',
  roundingSize: 'rounded-[50px]',
  roundingSizePreview: 'rounded-lg',
  coverBg: `url(${futureVisionImage})`,
  agendaBg: `url(${futureVisionImage})`,
  sectionBg: `url(${futureVisionImage})`,
};

export const corporateVision: ITemplate = {
  ...lightTemplate,
  fontFamily: 'poppins',
  themeId: 'corporateVision',
  title: 'Corporate vision',
  templateKey: 'corporateVision',
  id: 'pres6',
  coverBg: `url(${corporateVisionCoverImage})`,
  sectionBg: `url(${corporateVisionSectionImage})`,
  hideTitleImage: true,
};

export const monthlyReport: ITemplate = {
  ...lightTemplate,
  fontFamily: 'roboto',
  themeId: 'monthlyReport',
  title: 'Monthly report',
  templateKey: 'monthlyReport',
  id: 'pres7',
  coverBg: `url(${monthlyReportCover})`,
  sectionBg: `url(${monthlyReportSection})`,
  hideTitleImage: true,
};

export const fastTurn: ITemplate = {
  ...lightTemplate,
  fontFamily: 'bricolage-grotesque',
  themeId: 'fastTurn',
  title: 'Fast turn',
  templateKey: 'fastTurn',
  id: 'pres8',
  coverBg: `url(${fastTurnCover})`,
  sectionBg: `url(${fastTurnSection})`,
};

export const funAndGames: ITemplate = {
  ...lightTemplate,
  fontFamily: 'bowlby-one',
  themeId: 'funAndGames',
  title: 'Fun & Games',
  templateKey: 'funAndGames',
  id: 'pres9',
  coverBg: `url(${funAndGamesImage})`,
  sectionBg: `url(${funAndGamesImage})`,
  hideTitleImage: true,
};

export const creativeSpark: ITemplate = {
  ...lightTemplate,
  fontFamily: 'biorhyme',
  themeId: 'creativeSpark',
  title: 'Creative Spark',
  templateKey: 'creativeSpark',
  id: 'pres10',
  coverBg: `url(${creativeSparkCover})`,
  sectionBg: `url(${creativeSparkSection})`,
  agendaBg: `url(${creativeSparkAgenda})`,
};

export const pitchDeck: ITemplate = {
  ...lightTemplate,
  fontFamily: 'climate-crisis',
  themeId: 'pitchDeck',
  title: 'Pitch Deck',
  templateKey: 'pitchDeck',
  id: 'pres11',
  coverBg: `url(${pitchDeckImage})`,
  sectionBg: `url(${pitchDeckImage})`,
  hideTitleImage: true,
};
