# Índices globales (GSI) en DynamoDB de AWS: características, beneficios y costos

Los índices globales (GSI) son una característica esencial de Amazon DynamoDB que permite realizar consultas eficientes en una tabla utilizando una clave principal diferente a la clave principal de la tabla base. Esto proporciona flexibilidad para acceder a los datos de diferentes maneras y optimizar el rendimiento de las aplicaciones.

## ¿Qué son los índices globales (GSI)?

En lugar de simplemente replicar la información de la tabla base, un índice global en DynamoDB es una estructura de datos independiente que almacena una selección de atributos de la tabla base. Estos atributos se organizan mediante una clave principal que puede ser completamente diferente de la clave principal de la tabla base. Esta flexibilidad en la elección de la clave principal para el GSI es lo que permite realizar consultas eficientes en atributos que no forman parte de la clave principal original[1].

Un ejemplo del uso de GSI sería una tabla de "usuarios" con "ID de usuario" como clave principal. Si se necesita buscar usuarios por su dirección de correo electrónico, se puede crear un GSI con "correo electrónico" como clave principal. Esto permite realizar búsquedas rápidas y eficientes por correo electrónico sin tener que escanear toda la tabla[2].

## Características y beneficios de los GSI

Los GSI ofrecen varias características y beneficios que los hacen una herramienta poderosa para optimizar el rendimiento de las aplicaciones en DynamoDB:

* Consultas eficientes: Permiten realizar consultas rápidas y eficientes en atributos que no forman parte de la clave principal de la tabla base.
* Flexibilidad: Ofrecen la flexibilidad de acceder a los datos de diferentes maneras, lo que permite modelar varios patrones de acceso a las aplicaciones[3].
* Escalabilidad: Los GSI se escalan automáticamente junto con la tabla base, lo que garantiza un rendimiento constante incluso con grandes volúmenes de datos[3].
* Consistencia eventual: Los GSI se actualizan de forma asíncrona, lo que proporciona una alta disponibilidad y un rendimiento de escritura mejorado[4].
* Proyección de atributos: Se puede elegir qué atributos de la tabla base se proyectan en el GSI, lo que reduce el costo de almacenamiento y mejora el rendimiento de las consultas[2].

## Implementación de un GSI

La implementación de un GSI en DynamoDB se puede realizar a través de la consola de administración de AWS, la AWS CLI o los SDK de AWS. Al crear un GSI, se deben especificar los siguientes parámetros:

| Parameter | Description |
|-----------|-------------|
| Name | A unique name for the GSI. |
| Partition Key | The attribute that will be used as the partition key of the GSI. |
| Sort Key (optional) | The attribute that will be used as the sort key of the GSI. |
| Attribute Projection | The attributes from the base table that will be projected into the GSI. |
| Provisioned Throughput | The provisioned read and write capacity for the GSI. |

Es importante elegir la clave de partición y la clave de ordenamiento adecuadas para el GSI, ya que esto afectará el rendimiento de las consultas y los costos de almacenamiento. Se deben considerar los patrones de acceso a los datos de la aplicación y la distribución de los datos en la tabla base.

Para ilustrar el proceso, aquí hay un ejemplo de cómo crear un GSI usando la AWS CLI:

```bash
aws dynamodb update-table \
    --table-name GameScores \
    --attribute-definitions AttributeName=TopScore,AttributeType=N \
    --global-secondary-index-updates '[
        {
            "Create": {
                "IndexName": "GameTitle-TopScore-index",
                "KeySchema": [
                    {
                        "AttributeName": "GameTitle",
                        "KeyType": "HASH"
                    },
                    {
                        "AttributeName": "TopScore",
                        "KeyType": "RANGE"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 5,
                    "WriteCapacityUnits": 5
                }
            }
        }
    ]'
```

En este ejemplo, se crea un GSI llamado "GameTitle-TopScore-index" en la tabla "GameScores". La clave de partición del GSI es "GameTitle" y la clave de ordenamiento es "TopScore". Se proyectan todos los atributos de la tabla base en el GSI y se aprovisiona una capacidad de lectura y escritura de 5 unidades cada una[3].

## Consideraciones al cambiar los modos de capacidad en DynamoDB

Los índices secundarios globales heredan el modo de capacidad de lectura/escritura de la tabla base. Esto significa que si la tabla base está en modo de capacidad aprovisionada, el GSI también lo estará. Del mismo modo, si la tabla base está en modo bajo demanda, el GSI también lo estará[5].

Es importante tener en cuenta que al cambiar el modo de capacidad de la tabla base, el GSI también cambiará. Por ejemplo, si se cambia la tabla base de capacidad aprovisionada a bajo demanda, el GSI también cambiará a bajo demanda. Esto puede tener implicaciones en los costos y el rendimiento, por lo que es importante comprender las diferencias entre los modos de capacidad antes de realizar el cambio.

## Costos de implementar un GSI

La implementación de un GSI en DynamoDB tiene costos asociados que es importante comprender para optimizar el gasto y el rendimiento de la aplicación. Los costos se dividen en dos categorías principales:

### 1. Costos de almacenamiento:

El costo de almacenamiento de un GSI se basa en el tamaño de los atributos proyectados en el índice y el tamaño de la clave de índice. Para calcular el uso de almacenamiento de un GSI, se debe calcular el tamaño medio de un elemento de índice (incluyendo solo los atributos proyectados y la clave de índice) y multiplicarlo por el número de elementos de la tabla base que tienen atributos de clave de índice[2].

Es importante tener en cuenta que si un elemento de la tabla no tiene definido un atributo que está definido como clave de partición o de ordenamiento del índice, DynamoDB no escribirá ningún dato para ese elemento en el índice. Esto puede ayudar a reducir los costos de almacenamiento, especialmente cuando se utilizan índices dispersos[2].

Además del tamaño de los datos, el costo de almacenamiento también se ve afectado por la clase de tabla de DynamoDB que se utiliza. DynamoDB ofrece diferentes clases de tablas con diferentes características de rendimiento y costo. Por ejemplo, las tablas de clase estándar ofrecen el mayor rendimiento, pero también tienen el mayor costo de almacenamiento. Las tablas de clase de capacidad estándar infrecuente (IA) ofrecen un menor costo de almacenamiento para los datos a los que se accede con poca frecuencia, lo que las convierte en una buena opción para los GSI que no se utilizan con tanta frecuencia[6].

### 2. Costos de lectura y escritura:

Los GSI también incurren en costos de lectura y escritura, que se calculan en función del número de unidades de capacidad de lectura (RCU) y unidades de capacidad de escritura (WCU) consumidas por las operaciones de lectura y escritura en el índice[7].

Es importante destacar que las operaciones de escritura en un GSI se facturan además de las escrituras en la tabla base. Esto significa que cada vez que se escribe un elemento en la tabla base, también se consume una unidad de escritura para cada GSI que se actualiza[8].

Para optimizar los costos de lectura y escritura, se deben considerar los siguientes factores:
* Patrones de acceso a los datos: Se debe analizar cómo se accederá a los datos a través del GSI y ajustar la capacidad de procesamiento en consecuencia.
* Proyección de atributos: Proyectar solo los atributos necesarios en el GSI puede reducir los costos de almacenamiento y escritura.
* Escalado automático: Se puede utilizar el escalado automático de DynamoDB para ajustar dinámicamente la capacidad de procesamiento del GSI en función de la demanda[9].

Un punto importante a destacar es que no todos los atributos de la tabla base necesitan ser proyectados en un GSI. Esto puede ser una estrategia útil para optimizar costos y rendimiento. Por ejemplo, si solo se necesita un pequeño subconjunto de atributos para una consulta específica, se puede crear un GSI que solo proyecte esos atributos. Esto reduce la cantidad de datos que se escriben en el GSI y, por lo tanto, reduce los costos de escritura[7].

## Casos de uso de GSI

Los GSI se utilizan en una variedad de casos de uso para mejorar el rendimiento de las aplicaciones en DynamoDB. Algunos ejemplos comunes incluyen:

* Consultas por atributos no clave: Permitir consultas eficientes en atributos que no forman parte de la clave principal de la tabla base, como buscar usuarios por correo electrónico o productos por categoría[10].
* Consultas de agregación materializadas: Crear GSI con claves de partición que representen agregaciones de datos, como el total de ventas por día o el número de usuarios por país[11].
* Índices dispersos: Crear GSI que solo almacenen datos para un subconjunto de elementos en la tabla base, lo que reduce los costos de almacenamiento y mejora el rendimiento de las consultas para casos de uso específicos. Un ejemplo de esto sería un GSI cuya clave hash/rango no está poblada, lo que significa que el registro ni siquiera se copiará al índice. Estos índices dispersos tienen muchos casos de uso interesantes[7][12].

## Mejores prácticas para implementar GSI

Al implementar GSI en DynamoDB, se deben seguir algunas mejores prácticas para optimizar el rendimiento y los costos:

* Elegir la clave de partición adecuada: La clave de partición del GSI debe distribuir las operaciones de lectura y escritura de manera uniforme entre las particiones del índice[13].
* Utilizar proyecciones de atributos: Proyectar solo los atributos necesarios en el GSI puede reducir los costos de almacenamiento y mejorar el rendimiento de las consultas[14].
* Evitar la sobrecarga de índices: Crear demasiados GSI puede aumentar los costos de almacenamiento y escritura, y afectar el rendimiento de las escrituras en la tabla base[15].
* Monitorear el rendimiento: Utilizar Amazon CloudWatch para monitorear el rendimiento del GSI y detectar posibles problemas de escalabilidad o limitación[16].

Sobrecarga de la clave de índice secundario: Se puede "sobrecargar" el esquema de claves de un índice secundario para satisfacer múltiples patrones de acceso con un solo índice. Esto puede ser útil cuando se tienen varias consultas que necesitan acceder a los mismos datos, pero con diferentes claves de ordenamiento. Al utilizar la sobrecarga de índices, se puede reducir el número total de GSI necesarios, lo que puede reducir los costos y simplificar la administración[15].

Además de estas mejores prácticas, es importante tener en cuenta el impacto de las operaciones de backfill al crear un nuevo GSI. Durante la creación del índice, DynamoDB realiza operaciones de lectura en la tabla base para poblar el GSI. Estas operaciones de backfill pueden consumir capacidad de escritura en el GSI y, en algunos casos, pueden afectar el rendimiento de escritura de la tabla base. Es importante monitorear el rendimiento de la tabla base durante la creación del GSI y ajustar la capacidad de procesamiento según sea necesario para evitar problemas de limitación[5].

## Herramientas de AWS para administrar GSI

AWS proporciona varias herramientas que pueden ayudar a administrar y optimizar los GSI en DynamoDB:

* Consola de administración de AWS: La consola proporciona una interfaz gráfica para crear, modificar y eliminar GSI[3].
* AWS CLI: La CLI ofrece una interfaz de línea de comandos para administrar GSI[3].
* AWS SDK: Los SDK de AWS permiten administrar GSI programáticamente desde aplicaciones.
* NoSQL Workbench para DynamoDB: NoSQL Workbench es una aplicación de escritorio que proporciona herramientas para diseñar, visualizar y consultar datos en DynamoDB, incluyendo GSI[17].

## Conclusión

Los índices globales (GSI) son una característica esencial de DynamoDB que permite realizar consultas eficientes en atributos que no forman parte de la clave principal de la tabla base. Ofrecen flexibilidad, escalabilidad y un rendimiento mejorado para las aplicaciones. Sin embargo, es importante comprender los costos asociados con la implementación de un GSI para optimizar el gasto y el rendimiento de la aplicación.

Los principales factores que influyen en el costo de un GSI son el tamaño de los atributos proyectados, el tamaño de la clave de índice, la clase de tabla de DynamoDB y la capacidad de procesamiento aprovisionada. Para minimizar los costos, se recomienda proyectar solo los atributos necesarios, elegir la clase de tabla adecuada y utilizar el escalado automático para ajustar la capacidad de procesamiento según sea necesario.

Al seguir las mejores prácticas, como elegir la clave de partición adecuada, utilizar proyecciones de atributos, evitar la sobrecarga de índices y monitorear el rendimiento, se pueden aprovechar al máximo los GSI para crear aplicaciones escalables y de alto rendimiento en DynamoDB. Además, se debe considerar el impacto de las operaciones de backfill al crear un nuevo GSI y utilizar las herramientas de AWS disponibles para administrar y optimizar los GSI de manera eficiente.

Finalmente, es importante recordar que un GSI no siempre es la solución óptima para todos los patrones de consulta. Para patrones de acceso poco frecuentes, una operación de escaneo podría ser más rentable que crear un GSI[16].

## Works cited

1. docs.aws.amazon.com, accessed January 2, 2025, https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/GSI.html#:~:text=Un%20%C3%ADndice%20secundario%20global%20contiene,de%20clave%20de%20la%20tabla.
2. Uso de índices secundarios globales en DynamoDB - Amazon ..., accessed January 2, 2025, https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/GSI.html
3. Using Global Secondary Indexes in DynamoDB - AWS Documentation, accessed January 2, 2025, https://docs.aws.amazon.com/amazondynamodb/latest/
