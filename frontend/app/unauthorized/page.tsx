import Image from "next/image";

const Unauthorizedpage = () => {
    return (
        <div className="unauthenticated-conatiner">
            <Image src="/cancel.png" alt="unauthenticated image" width={100} height={100} />
            <h1 className="unauthenticated-title">Unauthenticated Access</h1>
        </div>
    )

}

export default Unauthorizedpage;
