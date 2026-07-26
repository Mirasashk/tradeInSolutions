"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CollectionListPageProps<T extends { id: string }> = {
  title: string;
  collection: string;
  listFn: (collection: string) => Promise<T[]>;
  editPath: string;
  getLabel: (item: T) => string;
  orderField?: "order" | "date";
};

export function CollectionListPage<T extends { id: string }>({
  title,
  collection,
  listFn,
  editPath,
  getLabel,
}: CollectionListPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listFn(collection).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [collection, listFn]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-navy">{title}</h1>
        <Button asChild>
          <Link href={`${editPath}edit/?id=new`}>Add new</Link>
        </Button>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No items yet.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Link key={item.id} href={`${editPath}edit/?id=${item.id}`}>
              <Card className="transition hover:border-brand-gold">
                <CardHeader>
                  <CardTitle className="text-base">{getLabel(item)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
