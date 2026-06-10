package bdom.kikwit.web;

import bdom.kikwit.Dto.EtablissementRequestDto;
import bdom.kikwit.Dto.EtablissementResponseDto;
import bdom.kikwit.Services.EtablissementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Etablissement", description = "Gestion des structures de santé")
public class EtablissementController {
    private EtablissementService service;
    // Enregistrement d'un etablissement
    @PostMapping(path = "/etablissements")
    @Operation(summary = "Enregistrement")
    public EtablissementResponseDto save(@RequestBody EtablissementRequestDto requestDto){
        return service.save(requestDto);
    }
    // Recupère la liste des etablissements
    @GetMapping(path = "/etablissements")
    @Operation(summary = "Liste des toutes les etablissements")
    public List<EtablissementResponseDto> list(){
        return  service.getAll();
    }
    /*
    * Recupère un seul etablissement
    * */
    @GetMapping(path = "/etablissements/{id}")
    @Operation(summary = "Affiche un etablissement")
    public EtablissementResponseDto getOne(@PathVariable Long id){
        return service.getOne(id);
    }
    /*
    *Modification d'un etablissement
    * */
    @PatchMapping(path = "/etablissements/{id}")
    @Operation(summary = "modification d'un etablissement")
    public EtablissementResponseDto update(@PathVariable Long id,@RequestBody EtablissementRequestDto requestDto){
        return  service.update(id,requestDto);
    }

    @DeleteMapping(path = "/etablissements/{id}")
    @Operation(summary = "Supprimé un etablissement")
    public String delete(@PathVariable Long id){
        return service.delete(id);
    }
}
