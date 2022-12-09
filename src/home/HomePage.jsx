import Link from 'shared/Link'

import './HomePage.css'

export default function HomePage() {
    return <div className="HomePage">
        <h1>Welcome to Project Ouroboros</h1>
        <div className="HomePage-Intro">
            Project Ouroboros is a <code>react</code> website running
            a <code>Python</code> backend.
            It contains several <em>applications</em> that allow you to
            program <code>react</code> applications using <code>Python</code> code!
            <br />
            <br />
            Each application provides a place to upload your <code>Python</code> file.
            Your file can import a <code>driver</code> module that can be
            used to interact with the <code>react</code>-side of a webpage.
            Each application's <code>driver</code> module is independent and
            unique; they do not share their contents.
            Available <code>driver</code> functions are documented on each
            application's page, and using them is simple.
            Below is an example that runs on the <em>Echo Console</em>:
            <pre>
                <code>from . import driver    # or from .driver import echo</code>
                <code>&nbsp;</code>
                <code>for lineIdx in range(10):</code>
                <code>&nbsp;&nbsp;&nbsp;&nbsp;{"driver.echo(f\"Hello line {lineIdx}\")"}</code>
            </pre>
            <br />
            Errors are printed to the Chrome console, so make sure to keep that
            open.
            You can also log your own things to the console using
            the lovely <code>print()</code> function!
            <br />
            <br />
            And with that, you're free to visit and implement whatever
            applications you want. Good luck!
        </div>
        <br />
        <h2>Applications</h2>
        <ul>
           <li>
                <Dot />
                <Link to="/console">Echo Console</Link>
            </li>
        </ul>
        {/* TODO: remove after grading */}
        <h2>Having trouble?</h2>
        <p>
            A note to the TAs: If this site isn't working, please make sure
            to consult my submission comment on Canvas if you haven't already.
            :)
        </p>
    </div>
}

function Dot() {
    return <h2 className="HomePage-Dot">•</h2>
}
