Para realizar consultas eficientes en DynamoDB usando campos que no son la llave primaria, existen dos enfoques principales:

## Índices Secundarios
El método más eficiente es crear un índice secundario:

**Tipos de Índices:**
- Índice Secundario Global (GSI): Permite usar una clave de partición diferente
- Índice Secundario Local (LSI): Usa la misma clave de partición pero diferente clave de ordenamiento[4]

## Proceso de Implementación

1. Crear el índice secundario en la tabla:
- Acceder a la consola de DynamoDB
- Seleccionar la tabla
- Ir a la pestaña de índices
- Crear nuevo índice especificando la columna deseada[9]

2. Realizar la consulta usando el índice:
```javascript
KeyConditionExpression = Key("columna_indexada").eq(valor),
IndexName = "nombre-del-indice"
```

## Consideraciones de Rendimiento

**Prácticas Recomendadas:**
- Mantener el número de índices al mínimo para reducir costos
- Proyectar solo los atributos necesarios en el índice
- Monitorear el consumo de capacidad de lectura/escritura
- Evitar crear índices para patrones de acceso poco frecuentes[4][10]

## Alternativas
Si no es posible crear un índice secundario, se puede usar Scan con FilterExpression, pero esto es significativamente menos eficiente ya que examina toda la tabla[1]. Esta opción solo debe usarse para conjuntos de datos pequeños o consultas poco frecuentes.

Citations:
[1] https://jairoandres.com/dynamodb-scan-vs-query/
[2] https://www.youtube.com/watch?v=c4g67W_GdYU
[3] https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/bp-indexes.html
[4] https://reintech.io/blog/best-practices-secondary-indexes-dynamodb
[5] https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/Query.html
[6] https://www.bmc.com/blogs/dynamodb-advanced-queries/
[7] https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes.html
[8] https://www.youtube.com/watch?v=Xr7I1hChPLo
[9] https://mydaytodo.com/how-to-query-dynamodb-with-non-primary-key-column/
[10] https://www.simform.com/blog/dynamodb-best-practices/

---

La forma más eficiente de realizar consultas específicas en DynamoDB se basa en varios principios clave:

## Diseño de Claves
- Estructurar las claves de partición y ordenamiento basándose en los patrones de acceso[1]
- Evitar claves "calientes" que reciban significativamente más tráfico[2]
- Utilizar claves compuestas para relaciones jerárquicas cuando sea necesario[3]

## Optimización de Consultas
**Prácticas Recomendadas:**
- Usar Query en lugar de Scan siempre que sea posible[2]
- Implementar ProjectionExpression para recuperar solo los atributos necesarios[5]
- Utilizar índices secundarios de manera eficiente, manteniéndolos al mínimo[9]

## Técnicas de Rendimiento
- Implementar caché para cargas de trabajo con lecturas frecuentes, lo que puede reducir costos hasta en un 80%[2]
- Utilizar BatchGetItem para obtener hasta 100 elementos en paralelo[3]
- Para conjuntos de datos grandes, implementar consultas paralelas dividiendo la consulta original en subconsultas[10]

## Paginación y Control
- Implementar paginación para conjuntos de resultados grandes[6]
- Utilizar FilterExpressions para refinar resultados en campos no indexados[3]
- Monitorear el rendimiento usando Contributor Insights para identificar patrones de acceso y claves throttled[3]

La clave del éxito radica en diseñar la estructura de datos y los índices basándose en los patrones de lectura específicos de la aplicación[1]. Las consultas más eficientes son aquellas que utilizan las claves de partición y ordenamiento de manera óptima[1].

Citations:
[1] https://www.reddit.com/r/aws/comments/p7ew2o/what_is_the_fastest_way_to_search_a_dynamodb/
[2] https://www.simform.com/blog/dynamodb-best-practices/
[3] https://dynobase.dev/dynamodb-best-practices/
[4] https://stackoverflow.com/questions/75600811/dynamodb-efficient-query-on-list
[5] https://dev.to/manojlingala/maximizing-efficiency-in-dynamodb-the-power-of-projections-2bl7
[6] https://dev.to/monikaprajapati_70/best-practices-for-dynamodb-4jh6
[7] https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.ReadData.Query.html
[8] https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html
[9] https://jayendrapatil.com/aws-dynamodb-best-practices/
[10] https://aws.amazon.com/blogs/database/use-parallelism-to-optimize-querying-large-amounts-of-data-in-amazon-dynamodb/

---

Los costos asociados con los índices secundarios globales (GSI) en DynamoDB se pueden desglosar en varios componentes:

## Costos de Almacenamiento
- 100 bytes adicionales de almacenamiento por cada elemento en el índice[4]
- El costo incluye el tamaño de la clave principal, la clave del índice y los atributos proyectados[4]
- El almacenamiento se cobra según los datos replicados en el índice

## Costos de Escritura
- Cada escritura en la tabla base que afecte al GSI consume unidades de capacidad de escritura adicionales[2]
- Con 4 GSIs, el costo de escritura puede incrementarse hasta 4 veces más que una tabla sin índices[2]
- Solo se consumen unidades de escritura cuando se modifican atributos proyectados en el índice[2]

## Costos de Lectura
- Las lecturas del GSI consumen sus propias unidades de capacidad de lectura[5]
- El GSI mantiene su propia configuración de capacidad de lectura independiente de la tabla base[1]

## Optimización de Costos
**Estrategias para reducir costos:**
- Proyectar solo los atributos necesarios en lugar de todos los atributos[3]
- Usar proyección KEYS_ONLY cuando sea posible[3]
- Considerar índices dispersos para reducir la cantidad de datos replicados[2]
- Evaluar el modo de capacidad (bajo demanda vs aprovisionado) según el patrón de uso[6]

Citations:
[1] https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/bp-indexes-general.html
[2] https://www.reddit.com/r/aws/comments/nfnskm/dynamo_gsi_cost/
[3] https://dynobase.dev/dynamodb-pricing-calculator/
[4] https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/GSI.html
[5] https://stackoverflow.com/questions/73250087/cost-of-adding-a-global-secondary-index-to-an-existing-dynamodb-table
[6] https://aws.amazon.com/dynamodb/pricing/
[7] https://www.youtube.com/watch?v=6A3HfcPuo0o
[8] https://www.gomomento.com/blog/maximize-cost-savings-and-scalability-with-an-optimized-dynamodb-secondary-index/
[9] https://www.cloudzero.com/blog/dynamodb-pricing/
[10] https://www.youtube.com/watch?v=cBM-utqiBI4
