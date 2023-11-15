import './style/vars.css';
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LGD Bot",
  description: "Documentation du bot Discord de Lyon Game Dev",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'GitHub', link: 'https://github.com/Urugash/lgd-discord-bot' }
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/wrHvuvfcNU' },
      { icon: 'github', link: 'https://github.com/Urugash/lgd-discord-bot' },
    ],

    sidebar: {
     '/guide/': [
      {
        text: 'Introduction',
        items: [{text: 'Introduction', link: '/guide/index.md'}]
      },
      {
        text: 'Global',
        items: [
          {text: 'Réclamer Rôle Adhérent', link: '/guide/global/claimMembership.md'}
        ],
      },
      // {
      //   text: 'Adhérents',
      //   items: [],
      // },
      // {
      //   text: 'Membres actifs',
      //   items: [],
      // },
      {
        text: 'Pole communication',
        items: [
          {text: 'Programmer un message', link: '/guide/communication/programMessage.md'}
        ],
      },
      // {
      //   text: "Conseil d'Administration",
      //   items: [],
      // },
     ],
      '/docs/': [
        {
          text: 'Commandes',
          items: [
            {text: 'Réclamer Rôle Adhérent', link: '/docs/claimMembership.md'},
            {text: 'Programmer un message', link: '/docs/programMessage.md'},
          ]
        },
     ]
    },
  }
})
