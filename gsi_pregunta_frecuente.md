Preguntas frecuentes: índices secundarios de DynamoDB

¿Qué son los índices secundarios de DynamoDB y por qué son útiles? 

Los índices secundarios de DynamoDB te permiten consultar datos de manera eficiente utilizando atributos que no sean la clave principal de la tabla base. Esto es útil porque, si bien DynamoDB proporciona un acceso rápido a los elementos a través de la clave principal, las aplicaciones a menudo necesitan recuperar datos basados en otros atributos. Los índices secundarios amplían sus opciones de consulta más allá de la estructura de clave principal de la tabla base.


¿Cuáles son los dos tipos de índices secundarios en DynamoDB? 

Hay dos tipos de índices secundarios: índices secundarios globales (GSI) e índices secundarios locales (LSI). Los GSI permiten un patrón de consulta flexible utilizando una clave de partición y una clave de ordenación diferentes de la tabla base. Los LSI, por otro lado, te permiten consultar utilizando la misma clave de partición que la tabla base, pero con una clave de ordenación diferente.


¿Cómo difieren los GSI y los LSI en términos de sus claves de partición y ordenación? 

Los GSI pueden usar cualquier atributo como clave de partición o clave de ordenación, independientemente del esquema de la tabla base. Esto ofrece una flexibilidad significativa en cómo estructura sus patrones de acceso a los datos. Los LSI están más limitados; deben usar la misma clave de partición que la tabla base, pero pueden usar un atributo diferente para la clave de ordenación dentro de esa partición.


¿Cuándo debo elegir un índice secundario global (GSI) en lugar de un índice secundario local (LSI)? 

Los GSI son una buena opción cuando necesitas consultar atributos que son diferentes de los atributos de clave principal de la tabla base, y si necesitas la flexibilidad de usar claves de partición diferentes. También son adecuados cuando sus patrones de consulta requieren acceder a datos en diferentes particiones. También son preferibles para el rendimiento de lectura porque no compiten por los recursos de la tabla base. Los GSI se pueden crear o eliminar en cualquier momento, lo que los hace más adaptables a las necesidades cambiantes de las aplicaciones. Un ejemplo de cuándo podría elegir un GSI es si necesitara consultar un registro de datos del dispositivo por estado de error, donde el estado de error sería su clave de partición y la marca de tiempo su clave de ordenación, incluso si su tabla base no usara esta estructura. .


¿Cuándo debo elegir un índice secundario local (LSI) en lugar de un índice secundario global (GSI)? 

Los LSI son una buena opción cuando estás consultando dentro de la misma clave de partición que la tabla base, pero necesitas una clasificación diferente. Esto mantiene la localidad de los datos en una sola partición. Los LSI deben considerarse en el momento del diseño de la tabla porque deben crearse al mismo tiempo que la tabla base y no se pueden eliminar. Debido a que comparten capacidad con la tabla base, solo deben usarse si se prevé que los patrones de lectura no causen puntos calientes en particiones específicas, lo que podría causar estrangulamiento. Un ejemplo donde esto tiene sentido es un escenario en el que desea consultar un dispositivo específico en función de su ID (la clave de partición) y luego ordenar los resultados por temperatura (una clave de ordenación).


¿Cuáles son las diferencias de consumo de recursos entre GSI y LSI? 

Los GSI se implementan como "tablas ocultas" y tienen sus propias unidades de capacidad de lectura y escritura, separadas de la capacidad de la tabla base. Esto significa que pueden manejar consultas sin afectar el rendimiento de las operaciones de la tabla base. Los LSI, por otro lado, usan las mismas unidades de capacidad que la tabla base. Esto significa que las consultas contra LSI pueden potencialmente competir por recursos con la tabla base. Esto es importante tenerlo en cuenta porque podrías terminar con estrangulamiento en tu mesa principal.


¿Cuáles son las limitaciones en el número de GSI y LSI por tabla y cuándo se pueden crear/eliminar? 

Puede crear hasta 20 GSI por tabla y este límite se puede aumentar previa solicitud. Los GSI se pueden crear o eliminar en cualquier momento después de la creación de la tabla. Puede crear hasta 5 LSI por tabla. Sin embargo, deben crearse en el momento de la creación de la tabla y no se pueden crear ni eliminar posteriormente.


¿Cuáles son las diferencias de consistencia de lectura entre GSI y LSI? 

Los GSI ofrecen solo consistencia eventual, lo que significa que puede haber un ligero retraso antes de que los cambios realizados en la tabla base se reflejen en el GSI. Los LSI le permiten elegir entre consistencia fuerte o consistencia eventual. Cuando se elige la consistencia fuerte, las lecturas contra un LSI reflejar

