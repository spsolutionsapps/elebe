# Componentes UI - shadcn/ui

Este directorio contiene componentes reutilizables basados en shadcn/ui.

## Componentes Disponibles

### button.tsx
Botones con múltiples variantes y tamaños.
```tsx
<Button variant="default" size="lg">
  Click me
</Button>
```

### card.tsx
Contenedores de tarjetas con header, content y footer.
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### input.tsx
Campos de entrada de texto.
```tsx
<Input type="email" placeholder="Email" />
```

### label.tsx
Etiquetas para formularios.
```tsx
<Label htmlFor="email">Email</Label>
```

### textarea.tsx
Áreas de texto multilínea.
```tsx
<Textarea placeholder="Description" />
```

### select.tsx
Selectores desplegables.
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### table.tsx
Componentes para tablas.
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Value</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### form.tsx
Formularios con validación integrada.
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Personalización

Los componentes se pueden personalizar modificando las clases de TailwindCSS en cada archivo.
