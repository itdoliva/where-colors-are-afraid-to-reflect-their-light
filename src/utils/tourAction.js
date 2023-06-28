export default function tourAction(node, currentStepPos) {

  const steps = node.querySelectorAll(':scope .tour-content > *')
	const promptNode = node.querySelector('.tour-prompt')
	const spotlightNode = node.querySelector('.tour-spotlight')
	// const arrowNode = node.querySelector('.tour-arrow')
	const bodyNode = node.querySelector('.tour-body')
  
	const promptStyle = promptNode.style
	const spotlightStyle = spotlightNode.style
	// const arrowStyle = arrowNode.style
  const spotPad = 12

  
  let curStep = currentStepPos

	function getNum(str) {
		return parseInt(str) || 0
	}

  function updatePos() {

    const step = steps[curStep]

    promptNode.classList.remove('tour-prompt-top')
    promptNode.classList.remove('tour-prompt-center')

		if (step.targetNode) {
			// set prompt position
			const rectPrompt = promptNode.getBoundingClientRect()
			const rectTarget = step.targetNode.getBoundingClientRect()

      const hPos = rectPrompt.width + rectTarget.width + 4 + spotPad*2 < window.innerWidth
      const vPos = rectPrompt.height + rectTarget.height + 4 + spotPad*2 < window.innerHeight

      promptStyle.top = '-2px'
      promptStyle.right = ''
      promptStyle.bottom = ''
      promptStyle.left = ''
      promptStyle.transform = ''

      if (hPos) {
        if (rectTarget.left - 2 - spotPad - rectPrompt.width > 0) {
          promptStyle.left = `-${rectPrompt.width + 12}px`
          
        }
        else {
          promptStyle.left = `${rectTarget.width + 4 + spotPad + 12}px`
        }

        if (rectTarget.top - 2 + rectPrompt.height > window.innerHeight) {
          console.log('over')
          promptStyle.top = ''
          promptStyle.bottom = '-2px'
          // promptStyle.top = `-${rectTarget.top - 2 + rectPrompt.height - window.innerHeight + 12}px`
        }
      }

      else if (vPos) {

        if (rectTarget.top - rectPrompt.height - 2 - spotPad*2 > 0) {
          promptStyle.top = `-${rectPrompt.height + 4 + spotPad*2}px`
        }
        else {
          promptStyle.top = `${rectTarget.height + 4 + spotPad*2}px`
        }

        if (rectTarget.width + 2*spotPad > rectPrompt.width) {
          promptStyle.left = '50%'
          promptStyle.transform = 'translate(-50%, 0)'
        } 
        else {
          promptStyle.left = `-2px`
        }
        
      }


      // controle height overflow
      if (rectTarget.bottom + rectPrompt.height + 5 < window.innerHeight) { // Prompt at Bottom
        // promptStyle.top = `${rectTarget.bottom + spotPad}px`
        // promptStyle.bottom = ''
      }
      else {
        // promptNode.classList.add('tour-prompt-top') // Prompt at Top
        // promptStyle.bottom = `${window.innerHeight - rectTarget.top + spotPad}px`
        // promptStyle.top = ''
      }

      // controle width overflow
      if (rectTarget.left - rectPrompt.width - 5 > 0) {
        // console.log('to the left')
        // promptStyle.left = `-${rectPrompt.width}px`
        // promptStyle.marginLeft = promptStyle.marginRight = ''
      } 
      else {
        // promptStyle.left = `${rectTarget.width + spotPad *2}px`
        // promptStyle.right = '0'
        // promptStyle.left = ''
        // promptStyle.marginLeft = promptStyle.marginRight = '5px'
      }

      


      

			// set arrow position
			// const pStyle = getComputedStyle(promptNode)
			// const aStyle = getComputedStyle(arrowNode)
			// arrowStyle.left =
			// 	rectTarget.width / 2 + rectTarget.left - getNum(pStyle.left) -
			// 	getNum(pStyle.marginLeft) - getNum(aStyle.borderLeftWidth) + 'px'

			// set spotlight position
			spotlightStyle.top = `${rectTarget.top - spotPad}px`
			spotlightStyle.left = `${rectTarget.left - spotPad}px`
			spotlightStyle.width = `${rectTarget.width + spotPad*2}px`
			spotlightStyle.height = `${rectTarget.height + spotPad*2}px`
		} 

    else {
			// set prompt to center
			const bodyRect = bodyNode.getBoundingClientRect()

      promptNode.classList.add('tour-prompt-center')
			promptStyle.top = `${(document.body.clientHeight - bodyRect.height) / 2}px`
			promptStyle.left = `${(document.body.clientWidth - bodyRect.width) / 2}px`

			// set spotlight to center
			spotlightStyle.top = `${document.body.clientHeight / 2}px`
			spotlightStyle.left = `${document.body.clientWidth / 2}px`
			spotlightStyle.width = '0'
			spotlightStyle.height = '0'
		}
  }


  function update(currentStepPos) {
    curStep = currentStepPos !== undefined ? currentStepPos : 0

    steps.forEach((d, i) => {
      if (curStep === i) {
        d.classList.add('active')
      } else {
        d.classList.remove('active')
      }
    })

    const step = steps[curStep]
    if (step && step.dataset && step.dataset.target) {
      step.targetNode = document.getElementById(step.dataset.target)

      step.targetNode?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }

    updatePos()
  }


  update()
	window.addEventListener('scroll', updatePos)
	window.addEventListener('resize', updatePos)

	return {
		update,
		destroy() {
			window.removeEventListener('scroll', updatePos)
			window.removeEventListener('resize', updatePos)
		}
	}
}