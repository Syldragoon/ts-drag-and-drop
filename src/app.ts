type Elt = {
    root: HTMLElement,
    form: {
        root: HTMLElement,
        inputs: {
            title: HTMLInputElement
            description: HTMLTextAreaElement
            people: HTMLInputElement
        }
        submit: HTMLButtonElement
    },
    list: {
        root: HTMLElement
        title: HTMLElement
        uList: HTMLUListElement
    },
    entry: HTMLElement
}

function autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
) {
    const orgMethod = descriptor.value
    const adjDesc: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = orgMethod.bind(this)
            return boundFn
        }
    }
    return adjDesc
}

class ProjectInput {
    elt: Elt
    projects: Project[] = []

    constructor (){
        this.elt = this.parseHTMLElements()
        
        // Attach event listener to form add btn
        this.elt.form.submit.addEventListener('click', this.onAddProjectBtnClicked)

        // Update list title
        this.elt.list.title.textContent = 'Mes projets'

        this.displayProjects()

        // Add elts to root
        this.elt.root.appendChild(this.elt.form.root)
        this.elt.root.appendChild(this.elt.list.root)
    }

    private parseHTMLElements(): Elt {
        const root = document.querySelector('#app')! as HTMLElement
        const formRoot = this.buildEltFromTemplateId('#project-input')
        const listRoot = this.buildEltFromTemplateId('#project-list')
        const entryRoot = this.buildEltFromTemplateId('#single-project')
        return {
            root,
            form: {
                root: formRoot,
                inputs: {
                    title: formRoot.querySelector('#title')! as HTMLInputElement,
                    description: formRoot.querySelector('#description')! as HTMLTextAreaElement,
                    people: formRoot.querySelector('#people')! as HTMLInputElement
                },
                submit: formRoot.querySelector('button')! as HTMLButtonElement
            },
            list: {
                root: listRoot,
                title: listRoot.querySelector('h2')! as HTMLElement,
                uList: listRoot.querySelector('ul')! as HTMLUListElement
            },
            entry: entryRoot.querySelector('li')! as HTMLElement,
        }
    }

    private buildEltFromTemplateId(id: string): HTMLElement {
        const t = document.querySelector(id)! as HTMLTemplateElement
        return t.content.cloneNode(true) as HTMLElement
    }

    @autobind
    private onAddProjectBtnClicked(event: Event): void {
        event.preventDefault()
        const { title, description, people } = this.elt.form.inputs
        const p = new Project(
            title.value,
            description.value,
            people.value
        )
        if(!p.isValid()){
            alert(p.validationError())
            return
        }
        this.clearInputs()
        this.projects.push(p)
        app.displayProjects()
    }

    private clearInputs (): void {
        Object.values(this.elt.form.inputs).map(elt => elt.value = '')
    }

    public displayProjects(): void {
        this.elt.list.uList.replaceChildren()
        for(const p of this.projects){
            const listItem = this.elt.entry.cloneNode(true)
            listItem.textContent = `${p}`
            this.elt.list.uList.appendChild(listItem)
        }
    }
}

class Project {
    private _title: string = ''
    private _description: string | null = null
    private _people: number = 0

    private _isValid: {
        title: boolean
        description: boolean
        people: boolean
    } = {
        title: false,
        description: false,
        people: false
    }

    constructor(title: string, description: string, people: string){
        this._isValid.title = title.length > 10
        this._isValid.description = description === '' || description.length > 10
        this._isValid.people = 
            (!isNaN(Number(people)))
            && parseInt(people) >= 0 && parseInt(people) <= 10

        if(this.isValid()){
            this._title = title
            this._description = description !== '' ? description : null
            this._people = parseInt(people)
        }
    }

    public isValid(): boolean {
        return Object.values(this._isValid).every(v => !!v)
    }

    public validationError(): string {
        if(this.isValid()) return ''
        return Object.entries(this._isValid)
            .reduce((prev: string, [k, v]) => {
                let next = prev
                if(v) return next
                if(next.length > 0){
                    next += '\n'
                }
                switch(k){
                    case 'title':
                        next += 'Title should be a string of 10 characters min'
                        break
                    case 'description':
                        next += 'Description should be empty or a string of 10 characters min'
                        break
                    case 'people':
                        next += 'People should be an integer between 0 and 10'
                        break
                }
                return next
            }, '')
    }

    public toString(): string {
        return `${this._title}${this._description ? ` - ${this._description}` : ''} - people: ${this._people}`
    }
}

const app = new ProjectInput()