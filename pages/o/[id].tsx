import {
  orgSignin,
  redirect,
} from "../../utils/authorization-config-util/authorizationConfigUtil";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import Home from "../../components/sections/home";
import { GetServerSidePropsContext } from "next";

// export async function getServerSideProps({ req, query, resolvedUrl }) {
//   console.log(req, query, resolvedUrl)
//   return { props: {} }
// }

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(context.req);
  const routerQuery = context.query.id;
  const session = await getSession(context);

  if (session === null || session === undefined || session.error) {
    return {
      props: { routerQuery },
    };
  } else {
    if (routerQuery !== session.orgId) {
      return redirect("/404");
    } else {
      return {
        props: { session },
      };
    }
  }
}

interface OrgProps {
  session: Session;
  routerQuery: string;
}

/**
 *
 * @param prop - session, routerQuery (orgId)
 *
 * @returns Organization distinct interace
 */
export default function Org(props: OrgProps) {
  const { session, routerQuery } = props;

  useEffect(() => {
    if (routerQuery) {
      console.log("router", routerQuery);
      orgSignin(routerQuery);

      return;
    }
  }, [routerQuery]);

  return session ? <Home name={session.orgName!} session={session} /> : null;
}
