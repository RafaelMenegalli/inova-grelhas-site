import { BlogIndexPage, blogIndexMetadata } from "@/components/blog/blog-pages";

export const metadata = blogIndexMetadata("en");

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
