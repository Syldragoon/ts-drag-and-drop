class ProjectInput {
    private addProjectBtn: HTMLElement

    constructor (){
        console.log('refreshed')

        const tProjectInput = document.querySelector('#project-input')! as HTMLTemplateElement
        // const tSingleProject = document.querySelector('#single-project')! as HTMLTemplateElement
        const tProjectList = document.querySelector('#project-list')! as HTMLTemplateElement
        const appRoot = document.querySelector('#app')!

        const projectInput = tProjectInput.content.cloneNode(true) as HTMLElement
        this.addProjectBtn = projectInput.querySelector('button')!
        this.addProjectBtn.addEventListener('click', this.addProject)

        const projectList = tProjectList.content.cloneNode(true) as HTMLElement
        const projectListTitle = projectList.querySelector('h2')!
        projectListTitle.textContent = 'Mes projets'

        appRoot.appendChild(projectInput)
        appRoot.appendChild(projectList)
    }

    private addProject(event: Event) {
        event.preventDefault()
        console.log('button clicked!')
    }
}

new ProjectInput()