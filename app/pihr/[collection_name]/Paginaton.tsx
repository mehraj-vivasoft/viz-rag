import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComponent({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  // Function to generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const showEllipsisStart = page > 3;
    const showEllipsisEnd = page < totalPages - 2;

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
      </PaginationItem>
    );

    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink href="?page=1" isActive={page === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Start ellipsis
    if (showEllipsisStart) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Generate middle pages
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      if (i <= page + 1 && i >= page - 1) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={`?page=${i}`} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // End ellipsis
    if (showEllipsisEnd) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={`?page=${totalPages}`}
            isActive={page === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href={`?page=${page < totalPages ? page + 1 : totalPages}`}
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>{generatePaginationItems()}</PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
