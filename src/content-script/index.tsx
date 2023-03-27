import { render } from 'preact'
import '../base.css'
import { getUserConfig, Language, Theme } from '../config'
import { detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import { config, SearchEngine } from './search-engine-configs'
import './styles.scss'
import { getPossibleElementByQuerySelector } from './utils'


const observer = new MutationObserver(watchYoutubeReady);

function watchYoutubeReady() {
  const playerContainer = document.getElementById('secondary');
  if (playerContainer) {
    run()
    observer.disconnect();
  }
}


observer.observe(document.body, {
  subtree: true,
  attributes: true,
});


// function sleep(ms: any) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
async function mount(question: string, siteConfig: SearchEngine) {
  // await sleep(2000)
  const container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const userConfig = await getUserConfig()
  let theme: Theme
  if (userConfig.theme === Theme.Auto) {
    theme = detectSystemColorScheme()
  } else {
    theme = userConfig.theme
  }
  if (theme === Theme.Dark) {
    container.classList.add('gpt-dark')
  } else {
    container.classList.add('gpt-light')
  }

  const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery) 
  if (siderbarContainer) {
    siderbarContainer.prepend(container)
  } else {
    container.classList.add('sidebar-free')
    const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
    if (appendContainer) {
      appendContainer.appendChild(container)
    }
  }

  render(
    <ChatGPTContainer question={question} triggerMode={userConfig.triggerMode || 'always'} />,
    container,
  )
}

const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName = location.hostname.match(siteRegex)![0]
const siteConfig = config[siteName]

async function run() {
 
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  if (searchInput && searchInput.value) {
    console.debug('Mount ChatGPT on', siteName)
    const userConfig = await getUserConfig()
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.value
        : `${searchInput.value}(in ${userConfig.language})`
    mount(searchValueWithLanguageOption, siteConfig)
  }

  if (siteName == 'youtube'){
    console.log("running on", siteName)
    mount('how to learn a language', siteConfig)
  }

}

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}

document.addEventListener('myCustomEvent', function(a) {
  console.log("HI HI HI",a.detail.message,"jjj")
  mount(a.detail.message, siteConfig)
}
);