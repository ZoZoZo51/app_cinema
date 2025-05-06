import { signIn } from "next-auth/react"

interface Props {
  type: string
  title: string
}

const ConnectionButton = (props: Props) => {
  return (<button className="mx-2 bg-gray-300 hover:bg-gray-400 rounded-md p-3" onClick={async () => await signIn(props.type)}>
    {props.title}
  </button>)
}

export default ConnectionButton