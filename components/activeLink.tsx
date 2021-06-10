import { useRouter } from 'next/router'
import { Children, cloneElement } from 'react'
import Link from 'next/link'



export default function ActiveLink({ children, activeClassName, href, ...props }) {
    const { asPath } = useRouter()
    const child = Children.only(children)
    const childClassName = child.props.className || ''

    const className = asPath === props.href || asPath === props.as ?
        `${childClassName} ${activeClassName}`.trim() : childClassName
    // alert(className)
    return (
        <Link href={href} {...props}>
            {
                cloneElement(child, { className: className || null })
            }
        </Link>
    )

}