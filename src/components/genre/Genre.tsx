import type { IGenre } from "@/types";
import React, { type FC } from "react";

interface Props {
  data: undefined | IGenre[];
}

const Genre: FC<Props> = ({ data }) => {
  return (
    <div className="flex overflow-auto gap-6">
      {data?.map((item: IGenre) => (
        <div className="text-nowrap" key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default React.memo(Genre);
