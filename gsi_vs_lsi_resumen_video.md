# Documento informativo: Índices secundarios de DynamoDB - GSI vs. LSI

## Introducción

Este documento resume una presentación de Srividhya Panchabakesan, arquitecta de soluciones de AWS, que se centra en cómo elegir entre índices secundarios globales (GSI) e índices secundarios locales (LSI) en Amazon DynamoDB. La pregunta central que se aborda es: ¿cuándo y por qué se debe elegir entre un GSI o un LSI para el acceso a los datos más allá de la clave principal?

## Conceptos clave

### Acceso mediante clave principal
DynamoDB proporciona un acceso rápido a los elementos basándose en la clave principal (clave de partición y clave de clasificación, si procede) de la tabla.

### Índices secundarios
Los índices secundarios permiten un acceso eficiente a los datos basándose en atributos distintos de la clave principal de la tabla. Esto ayuda a admitir diversos patrones de consulta.

## Índices secundarios globales (GSI)

### Flexibilidad
Los GSI permiten especificar una clave de partición y una clave de clasificación completamente diferentes a las de la tabla base. Esto proporciona la máxima flexibilidad para los patrones de consulta. Como señala el orador: "Se considera 'global' porque las consultas de índice pueden abarcar todos los datos de la tabla base, en todas las particiones".

### Implementación
- Un GSI se implementa como una "tabla en la sombra", lo que significa que es una tabla separada con sus propias unidades de capacidad de lectura y escritura.
- "Cuando se escribe en la tabla base, [se] propaga al GSI en segundo plano. Es eventualmente consistente".

### Características principales
- **Capacidad**: Los GSI tienen su propia capacidad de lectura y escritura que no compite con la capacidad de la tabla base.
- **Creación y modificación**: 
  - Se pueden crear hasta 20 GSI por tabla
  - Los GSI pueden crearse o eliminarse en cualquier momento después de la creación de la tabla base
  - Los datos se rellenan de nuevo en el GSI tras su creación
- **Escalabilidad**: Las colecciones de elementos GSI pueden dividirse y no tienen límite de tamaño o rendimiento
- **Consistencia**: Los GSI ofrecen consistencia eventual

## Índices secundarios locales (LSI)

### Flexibilidad limitada
Los LSI utilizan la misma clave de partición que la tabla base, pero pueden tener una clave de ordenación diferente. Como explica el presentador: "Aquí se puede utilizar la misma clave de partición, pero una clave de ordenación diferente. Es local porque todo permanece en la misma partición."

### Implementación
Los LSI se mantienen dentro de la partición de la tabla base. "El LSI se mantiene en la tabla base y se sincronizará".

### Características principales
- **Capacidad**: Los LSI consumen la capacidad de lectura y escritura de la tabla base
- **Creación y modificación**:
  - Se pueden crear hasta 5 LSI por tabla
  - Los LSI deben crearse en el momento de la creación de la tabla
  - No pueden crearse ni eliminarse posteriormente
- **Particionamiento**: Los LSI no se pueden dividir
- **Límites de tamaño**: El tamaño combinado de los elementos con la misma clave de partición en la tabla base más todos los elementos del LSI no puede exceder los 10 GB
- **Consistencia**: Los LSI permiten elegir entre consistencia fuerte o consistencia eventual

## Ejemplos de casos de uso

### Datos de temperatura del dispositivo
1. **Consulta**: Últimas 10 lecturas de temperatura para un dispositivo
   - Solución: Se puede lograr a través de la tabla base si la clave principal contiene información de dispositivo y marca de tiempo

2. **Consulta**: Lecturas con un estado de error específico
   - Solución: Requiere un GSI usando el estado de error como clave de partición y la marca de tiempo como clave de ordenación

3. **Consulta**: Errores para un dispositivo determinado
   - Solución: Puede usar un LSI si la clave de partición de la tabla base es la identificación del dispositivo
   - Alternativa: También podría usar un GSI con las claves de partición y ordenación apropiadas

## Resumen de diferencias clave

| Característica | Índice Secundario Global (GSI) | Índice Secundario Local (LSI) |
|---------------|--------------------------------|------------------------------|
| Clave de Partición | Diferente a la PK de la tabla base | Igual a la PK de la tabla base |
| Clave de Ordenación | Diferente a la SK de la tabla base | Diferente a la SK de la tabla base |
| Implementación | Tabla de sombras | Mantenida en la tabla base |
| Capacidad | Propias unidades de lectura/escritura | Compite con la capacidad de la tabla base |
| Creación/Eliminación | En cualquier momento | Solo en la creación de la tabla |
| Límite por tabla | 20 | 5 |
| Tamaño del elemento | Máximo de 400 KB | Máximo de 400 KB, a través de todos los LSI por elemento |
| Escalabilidad | Las colecciones de elementos se pueden dividir | Las colecciones de elementos no se pueden dividir |
| Tamaño máximo de la colección de elementos | Sin límite | 10 GB |
| Consistencia | Consistencia eventual | Consistencia fuerte o eventual |

## Consideraciones para elegir

1. **Patrones de consulta**: Si necesita consultar datos usando una estructura de clave primaria completamente diferente (claves de partición y ordenación), se requiere un GSI.

2. **Tamaño de los datos**: Si los datos dentro de una partición (incluyendo elementos de la tabla base y elementos LSI relacionados) excederán los 10 GB, no puede usar un LSI.

3. **Rendimiento**: Los GSI ofrecen rendimiento dedicado, mientras que los LSI comparten el rendimiento de la tabla base.

4. **Flexibilidad**: Si prevé la necesidad de agregar índices secundarios después de la creación de la tabla, debe usar GSI.

## Conclusión

Elegir entre GSI y LSI depende en gran medida de las necesidades específicas de su aplicación. Mientras que los LSI pueden ser útiles para claves de ordenación alternativas dentro de la misma partición, vienen con limitaciones relacionadas con el tamaño, la creación y el rendimiento. Los GSI ofrecen mayor flexibilidad y escalabilidad, haciéndolos la opción más común para aplicaciones complejas. Comprender las ventajas y desventajas entre estos tipos de índices es crítico para diseñar soluciones DynamoDB eficientes y rentables.

## Glosario de Términos Clave

* **DynamoDB:** Un servicio de base de datos de documentos y clave-valor totalmente administrado y sin servidor ofrecido por Amazon Web Services.

* **Primary Key (Clave Primaria):** El identificador único para un elemento en una tabla DynamoDB, que puede ser una clave de partición, o una combinación de una clave de partición y una clave de ordenación.

* **Secondary Index (Índice Secundario):** Una estructura de datos que permite consultar una tabla DynamoDB utilizando atributos distintos de la clave primaria.

* **Global Secondary Index (GSI):** Un tipo de índice secundario en DynamoDB que permite consultas flexibles con diferentes claves de partición y ordenación que la tabla base y se implementa como una tabla sombra con su propia capacidad de lectura/escritura.

* **Local Secondary Index (LSI):** Un tipo de índice secundario en DynamoDB que utiliza la misma clave de partición que la tabla base, pero una clave de ordenación diferente, y se mantiene en la misma partición y consume el rendimiento de la tabla base.

* **Partition Key (Clave de Partición):** El atributo de clave primaria utilizado para determinar en qué partición se almacena un elemento. Debe ser único dentro de una partición, pero no necesariamente único en toda la tabla.

* **Sort Key (Clave de Ordenación):** Un atributo de clave primaria opcional que se utiliza junto con la clave de partición para organizar elementos dentro de la misma partición y proporcionar flexibilidad de consulta dentro de esa partición.

* **Read Consistency (Consistencia de Lectura):** Se refiere a si una operación de lectura refleja la escritura más reciente. DynamoDB ofrece consistencia eventual (para GSIs) u opciones de consistencia fuerte (para LSIs).

* **Eventual Consistency (Consistencia Eventual):** Un modelo de consistencia en el que los cambios de datos pueden tardar algún tiempo en propagarse a todas las ubicaciones de almacenamiento, lo que significa que una operación de lectura puede no reflejar siempre la escritura más reciente.

* **Strong Consistency (Consistencia Fuerte):** Un modelo de consistencia en el que cualquier operación de lectura refleja la operación de escritura más reciente. Está garantizada para LSIs pero no para GSIs, a menos que se utilicen configuraciones específicas.

* **Shadow Table (Tabla Sombra):** El mecanismo utilizado para GSIs, que representa la tabla completa y una tabla separada con su propia capacidad de rendimiento de lectura/escritura.

* **Throughput (Rendimiento):** La medida de las operaciones de lectura y escritura que puede manejar una base de datos. La capacidad en DynamoDB se mide en unidades de capacidad de lectura (RCUs) y unidades de capacidad de escritura (WCUs).

* **Item Collection (Colección de Elementos):** Un conjunto de elementos en una tabla DynamoDB que comparten el mismo valor de clave de partición.
