import { BlogIndexPage, blogIndexMetadata } from "@/components/blog/blog-pages";

export const metadata = blogIndexMetadata("pt");

export default function Page() {
  return <BlogIndexPage locale="pt" />;
}
