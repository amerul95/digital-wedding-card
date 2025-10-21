import React from 'react'

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Designs({params}:PageProps) {
    const {id} = params
  return (
    <div>
      {id}
    </div>
  )
}
